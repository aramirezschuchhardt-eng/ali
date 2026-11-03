"""Genera dist/ para publicar en Cloudflare Pages:
- dist/avance-inmobiliario.html : un solo archivo autocontenido (CSS, JS y logo incluidos)
- dist/avance-inmobiliario-sitio.zip : sitio completo con panel admin (subir el ZIP en Cloudflare Pages)
Uso: python3 tools/build.py
"""
import base64, os, re, zipfile
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rd = lambda p: open(os.path.join(R, p), encoding="utf-8").read()
b64 = lambda p, m: f"data:{m};base64," + base64.b64encode(open(os.path.join(R, p), "rb").read()).decode()
os.makedirs(os.path.join(R, "dist"), exist_ok=True)

h = rd("index.html")
logo = b64("assets/img/logo-avance.png", "image/png")
h = h.replace('<link rel="stylesheet" href="assets/css/styles.css">', "<style>\n" + rd("assets/css/styles.css") + "\n</style>")
h = h.replace('href="assets/img/favicon.svg"', 'href="' + b64("assets/img/favicon.svg", "image/svg+xml") + '"')
h = h.replace('src="assets/img/logo-avance.png"', 'src="' + logo + '"')
for js in ["config", "data", "main"]:
    tag = re.search(rf'<script src="assets/js/{js}\.js"[^>]*></script>', h).group(0)
    h = h.replace(tag, "<script>\n" + rd(f"assets/js/{js}.js").replace("</script", "<\\/script") + "\n</script>")
rest = re.sub(r'https?://\S+', "", h)
assert 'src="assets/' not in rest and 'href="assets/' not in rest, "quedan rutas locales"
open(os.path.join(R, "dist/avance-inmobiliario.html"), "w", encoding="utf-8").write(h)
os.makedirs(os.path.join(R, "dist/html"), exist_ok=True)
open(os.path.join(R, "dist/html/index.html"), "w", encoding="utf-8").write(h)  # listo para subir tal cual

files = ["index.html", "admin.html", "robots.txt", "sitemap.xml"]
for d, _, fs in os.walk(os.path.join(R, "assets")):
    files += [os.path.relpath(os.path.join(d, f), R) for f in fs]
with zipfile.ZipFile(os.path.join(R, "dist/avance-inmobiliario-sitio.zip"), "w", zipfile.ZIP_DEFLATED) as z:
    for f in sorted(files):
        z.write(os.path.join(R, f), f)
print("OK:", len(h)//1024, "KB html,", len(files), "archivos en zip")
