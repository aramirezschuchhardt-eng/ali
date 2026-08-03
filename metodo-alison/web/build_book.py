#!/usr/bin/env python3
"""Convierte el manuscrito de EL MÉTODO ALISON a una página web de lectura."""
import html
import os
import re

SRC = "/home/user/ali/metodo-alison"
FILES = [
    "00-portada-y-como-usar.md", "01-prologo.md",
    "02-parte1-cap01-02.md", "03-parte1-cap03-04.md",
    "04-parte2-cap05-06.md", "05-parte2-cap07-08.md", "06-parte2-cap09.md",
    "07-parte3-cap10-11.md", "08-parte3-cap12-13.md",
    "09-parte4-cap14-15.md", "10-parte4-cap16-17.md", "11-parte4-cap18.md",
    "12-parte5-cap19-20.md", "13-parte5-cap21-22.md",
    "14-parte6-cap23-24.md", "15-parte6-cap25-26.md",
    "16-parte6-cap27-28.md", "17-parte6-cap29-30.md",
    "18-anexo-a-plantillas.md", "19-anexos-c-d-e.md",
]

# ---------------------------------------------------------------- inline

CODE_RE = re.compile(r"`([^`]+)`")


def marker_class(inner):
    if inner.startswith("[DATO REAL"):
        return "flag flag--dato", "DATO"
    if inner.startswith("[ESCENA"):
        return "flag flag--escena", "ESCENA"
    if inner.startswith("[VERIFICAR"):
        return "flag flag--verificar", "VERIFICAR"
    if inner.startswith("["):
        return "blank", None
    return "", None


def inline(text):
    """Escapa y aplica formato en línea. Protege los code spans."""
    stash = []

    def keep(m):
        raw = m.group(1)
        cls, label = marker_class(raw)
        body = html.escape(raw)
        if label:
            body = html.escape(raw[1:-1]) if raw.endswith("]") else body
            piece = f'<span class="{cls}"><b>{label}</b>{body[len(label):] if body.startswith(label) else body}</span>'
            piece = f'<span class="{cls}">{body}</span>'
        elif cls == "blank":
            piece = f'<span class="blank">{body}</span>'
        else:
            piece = f"<code>{body}</code>"
        stash.append(piece)
        return f"\x00{len(stash) - 1}\x00"

    text = CODE_RE.sub(keep, text)
    text = html.escape(text)
    text = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<![\w*])\*([^*\n]+?)\*(?!\w)", r"<em>\1</em>", text)
    text = re.sub(r"\x00(\d+)\x00", lambda m: stash[int(m.group(1))], text)
    return text


def only_flag(h):
    return re.fullmatch(r'<span class="flag[^"]*">.*</span>', h.strip()) is not None


# ---------------------------------------------------------------- block

def render(lines):
    out = []
    i = 0
    n = len(lines)
    first_h2_seen = [False]

    def flush_para(buf):
        if not buf:
            return
        h = inline(" ".join(buf).strip())
        if h:
            if only_flag(h):
                out.append(f"<aside class=\"note\">{h}</aside>")
            else:
                out.append(f"<p>{h}</p>")
        buf.clear()

    para = []
    while i < n:
        line = lines[i]
        s = line.strip()

        # fenced block -> hoja de trabajo
        if s.startswith("```"):
            flush_para(para)
            i += 1
            buf = []
            while i < n and not lines[i].strip().startswith("```"):
                buf.append(lines[i].rstrip("\n"))
                i += 1
            i += 1
            body = html.escape("\n".join(buf))
            body = re.sub(r"_{3,}", lambda m: f'<i class="fill">{m.group(0)}</i>', body)
            out.append(f'<pre class="sheet">{body}</pre>')
            continue

        # tabla
        if s.startswith("|") and i + 1 < n and re.match(r"^\|[\s:|-]+\|$", lines[i + 1].strip()):
            flush_para(para)
            head = [c.strip() for c in s.strip("|").split("|")]
            i += 2
            rows = []
            while i < n and lines[i].strip().startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            th = "".join(f"<th>{inline(c)}</th>" for c in head)
            body = ""
            for r in rows:
                body += "<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>"
            out.append(
                f'<div class="tablewrap"><table><thead><tr>{th}</tr></thead><tbody>{body}</tbody></table></div>'
            )
            continue

        # cita
        if s.startswith(">"):
            flush_para(para)
            buf = []
            while i < n and lines[i].strip().startswith(">"):
                buf.append(lines[i].strip()[1:].strip())
                i += 1
            chunks, cur = [], []
            for b in buf:
                if b:
                    cur.append(inline(b))
                elif cur:
                    chunks.append("<br>".join(cur))
                    cur = []
            if cur:
                chunks.append("<br>".join(cur))
            inner = "".join(f"<p>{c}</p>" for c in chunks)
            out.append(f"<blockquote>{inner}</blockquote>")
            continue

        # checklist
        if re.match(r"^- \[[ x]\] ", s):
            flush_para(para)
            items = []
            while i < n and re.match(r"^- \[[ x]\] ", lines[i].strip()):
                done = lines[i].strip()[3] == "x"
                items.append(
                    f'<li class="check{" is-done" if done else ""}">'
                    f'<span class="box" aria-hidden="true"></span>'
                    f'<span>{inline(lines[i].strip()[6:])}</span></li>'
                )
                i += 1
            out.append('<ul class="checklist">' + "".join(items) + "</ul>")
            continue

        # lista con viñetas
        if s.startswith("- "):
            flush_para(para)
            items = []
            while i < n and lines[i].strip().startswith("- "):
                cur = lines[i].strip()[2:]
                i += 1
                while i < n and lines[i].strip() and not re.match(
                    r"^(-|\d+\.|#|>|\||```)", lines[i].strip()
                ):
                    cur += " " + lines[i].strip()
                    i += 1
                items.append(f"<li>{inline(cur)}</li>")
            out.append("<ul>" + "".join(items) + "</ul>")
            continue

        # lista numerada
        if re.match(r"^\d+\. ", s):
            flush_para(para)
            items = []
            start = int(re.match(r"^(\d+)\.", s).group(1))
            while i < n and re.match(r"^\d+\. ", lines[i].strip()):
                cur = re.sub(r"^\d+\. ", "", lines[i].strip())
                i += 1
                while i < n and lines[i].strip() and not re.match(
                    r"^(-|\d+\.|#|>|\||```)", lines[i].strip()
                ):
                    cur += " " + lines[i].strip()
                    i += 1
                items.append(f"<li>{inline(cur)}</li>")
            out.append(f'<ol start="{start}">' + "".join(items) + "</ol>")
            continue

        # encabezados
        m = re.match(r"^(#{2,4})\s+(.*)$", s)
        if m:
            flush_para(para)
            level, txt = len(m.group(1)), m.group(2)
            if level == 2 and not first_h2_seen[0]:
                first_h2_seen[0] = True  # el subtítulo ya se usó en la portadilla
                i += 1
                continue
            tag = {2: "h2", 3: "h3", 4: "h4"}[level]
            out.append(f"<{tag}>{inline(txt)}</{tag}>")
            i += 1
            continue

        if s in ("---", "***", "___"):
            flush_para(para)
            i += 1
            continue

        if not s:
            flush_para(para)
            i += 1
            continue

        para.append(s)
        i += 1

    flush_para(para)
    return "\n".join(out)


# ---------------------------------------------------------------- parse

def load():
    chunks = []
    for name in FILES:
        with open(os.path.join(SRC, name), encoding="utf-8") as fh:
            text = fh.read()
        if name.startswith("00"):
            text = text.split("## ÍNDICE GENERAL")[0]
            text = text.split("## NOTA DE PRODUCCIÓN", 1)[1]
            text = (
                "# NOTA DE PRODUCCIÓN\n## Lo que falta antes de publicar\n"
                + text.split("\n", 1)[1]
            )
            text = text.replace(
                "## CÓMO USAR ESTA GUÍA",
                "# CÓMO USAR ESTA GUÍA\n## Este no es un libro para leer",
            )
        chunks.append(text)
    return "\n\n".join(chunks).split("\n")


def sections():
    lines = load()
    secs, cur = [], None
    for line in lines:
        m = re.match(r"^#\s+(.*)$", line.strip())
        if m and not line.strip().startswith("##"):
            if cur:
                secs.append(cur)
            cur = {"raw": m.group(1).strip(), "lines": []}
        elif cur is not None:
            cur["lines"].append(line)
    if cur:
        secs.append(cur)
    return secs


def subtitle_of(sec):
    for line in sec["lines"]:
        m = re.match(r"^##\s+(.*)$", line.strip())
        if m:
            return m.group(1).strip()
    return ""


def build():
    secs = sections()
    parts, body, slug_seen = [], [], {}
    group = None

    for sec in secs:
        raw = sec["raw"]
        sub = subtitle_of(sec)

        if raw.startswith("PARTE"):
            label, _, name = raw.partition("—")
            group = {
                "label": label.strip(),
                "name": name.strip(),
                "items": [],
            }
            parts.append(group)
            epi = render(sec["lines"]).replace("<blockquote>", '<blockquote class="epigraph">')
            body.append(
                f'<section class="part" id="{slugify(label.strip(), slug_seen)}">'
                f'<p class="part__label">{html.escape(label.strip())}</p>'
                f'<h2 class="part__name">{html.escape(name.strip())}</h2>'
                f"{epi}</section>"
            )
            continue

        if group is None or raw.startswith("ANEXO"):
            if raw.startswith("ANEXO") and (group is None or group["label"] != "ANEXOS"):
                group = {"label": "ANEXOS", "name": "Material de trabajo", "items": []}
                parts.append(group)
            elif group is None:
                group = {"label": "APERTURA", "name": "", "items": []}
                parts.append(group)

        num = ""
        cm = re.match(r"^CAPÍTULO\s+(\d+)$", raw)
        if cm:
            num = cm.group(1).zfill(2)
            eyebrow = f"Capítulo {int(num)}"
        elif raw.startswith("ANEXO"):
            eyebrow = raw.title().replace("Anexo", "Anexo")
            num = raw.split()[-1]
        else:
            eyebrow = raw.capitalize() if raw.isupper() else raw
        title = sub or raw

        sid = slugify(f"{raw}-{title}", slug_seen)
        if cm:
            toc_title = title
        elif raw.startswith("ANEXO"):
            toc_title = title
        else:
            toc_title = eyebrow
        group["items"].append(
            {"id": sid, "num": num, "title": toc_title, "kind": "cap" if cm else "other"}
        )

        body.append(
            f'<section class="chapter" id="{sid}">'
            f'<header class="chapter__head">'
            f'<p class="eyebrow">{html.escape(eyebrow)}</p>'
            f'<h2 class="chapter__title">{html.escape(title)}</h2>'
            f'</header>{render(sec["lines"])}</section>'
        )

    return parts, "\n".join(body)


def slugify(text, seen):
    base = re.sub(r"[^a-z0-9]+", "-", strip_accents(text.lower())).strip("-")[:60] or "s"
    seen[base] = seen.get(base, 0) + 1
    return base if seen[base] == 1 else f"{base}-{seen[base]}"


def strip_accents(s):
    table = str.maketrans("áéíóúñüàèìòù", "aeiounuaeiou")
    return s.translate(table)


def toc_html(parts):
    out = []
    for p in parts:
        out.append('<div class="toc__group">')
        out.append(f'<p class="toc__label">{html.escape(p["label"])}</p>')
        if p["name"]:
            out.append(f'<p class="toc__name">{html.escape(p["name"])}</p>')
        out.append("<ul>")
        for it in p["items"]:
            n = f'<span class="toc__num">{it["num"]}</span>' if it["num"] else '<span class="toc__num toc__num--dot">·</span>'
            out.append(
                f'<li><a href="#{it["id"]}" data-target="{it["id"]}">{n}'
                f'<span class="toc__t">{html.escape(it["title"])}</span></a></li>'
            )
        out.append("</ul></div>")
    return "\n".join(out)


if __name__ == "__main__":
    parts, body = build()
    with open("/tmp/claude-0/-home-user-ali/0e3c708c-74bd-5533-9ae6-edb8fa085d14/scratchpad/_toc.html", "w", encoding="utf-8") as f:
        f.write(toc_html(parts))
    with open("/tmp/claude-0/-home-user-ali/0e3c708c-74bd-5533-9ae6-edb8fa085d14/scratchpad/_body.html", "w", encoding="utf-8") as f:
        f.write(body)
    caps = sum(1 for p in parts for it in p["items"])
    print(f"partes={len(parts)} secciones={caps} body={len(body)//1024}KB")
