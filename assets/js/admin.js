/* AVANCE INMOBILIARIO – Panel de administración (sin servidor) */
(function () {
  "use strict";
  const CFG = window.AVANCE_CONFIG || {};
  const KEY = "avance_data_preview";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nf = new Intl.NumberFormat("es-CL");

  let data;
  try { data = JSON.parse(localStorage.getItem(KEY)) || null; } catch (e) { data = null; }
  if (!data) data = JSON.parse(JSON.stringify(window.AVANCE_DATA || { beneficios: [], perfiles: [], proyectos: [] }));
  let editingId = null;

  function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("show"); setTimeout(() => el.classList.remove("show"), 2200); }
  function save(msg) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { alert("No se pudo guardar localmente: " + e.message); }
    if (msg) toast(msg);
  }

  /* Login */
  function enter() { $("#login").classList.add("hidden"); $("#app").classList.remove("hidden"); renderAll(); }
  if (sessionStorage.getItem("avance_admin") === "1") enter();
  $("#login-form").addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("#pwd").value === CFG.adminPassword) { sessionStorage.setItem("avance_admin", "1"); enter(); }
    else $("#login-msg").textContent = "Clave incorrecta.";
  });

  /* Tabs */
  $$(".tab").forEach((t) => t.addEventListener("click", () => {
    $$(".tab").forEach((x) => x.classList.toggle("is-active", x === t));
    $$("[data-pane]").forEach((p) => p.classList.toggle("hidden", p.dataset.pane !== t.dataset.tab));
    if (t.dataset.tab === "leads") renderLeads();
  }));

  function renderAll() { renderProjects(); renderBenefits(); renderProfiles(); $("#upd-date").value = data.actualizado || ""; }

  /* Proyectos */
  function renderProjects() {
    $("#proj-rows").innerHTML = data.proyectos.map((p, i) => `
      <tr>
        <td><img src="${esc(p.imagen)}" alt="" onerror="this.style.visibility='hidden'"></td>
        <td><strong>${esc(p.nombre)}</strong>${p.destacado ? ' <span class="pill">★ destacado</span>' : ""}</td>
        <td>${esc(p.comuna)}</td>
        <td>${nf.format(p.precioDesde)}</td>
        <td>${p.bonoPie || 0}%</td>
        <td>${p.descuento || 0}%</td>
        <td>$${nf.format(p.arriendoEstimado || 0)}</td>
        <td>${esc(p.entrega)}</td>
        <td><span class="pill ${p.activo !== false ? "on" : "off"}">${p.activo !== false ? "Publicado" : "Oculto"}</span></td>
        <td style="white-space:nowrap">
          <button class="btn btn--line mini" data-edit="${esc(p.id)}">Editar</button>
          <button class="btn btn--line mini" data-up="${i}" title="Subir">↑</button>
          <button class="btn btn--line mini" data-dup="${esc(p.id)}" title="Duplicar">⧉</button>
          <button class="btn btn--line mini" data-del="${esc(p.id)}" title="Eliminar">✕</button>
        </td>
      </tr>`).join("");
  }

  function openForm(p) {
    const f = $("#proj-form");
    editingId = p ? p.id : null;
    $("#proj-form-title").textContent = p ? "Editar: " + p.nombre : "Nuevo proyecto";
    p = p || { activo: true, beneficios: [], dormitorios: [] };
    ["nombre", "inmobiliaria", "comuna", "direccion", "precioDesde", "bonoPie", "descuento", "arriendoEstimado", "entrega", "tipologias", "promocion", "imagen", "descripcion"]
      .forEach((k) => { f.elements[k].value = p[k] ?? ""; });
    f.elements.dormitorios.value = (p.dormitorios || []).join(",");
    f.elements.destacado.checked = !!p.destacado;
    f.elements.activo.checked = p.activo !== false;
    $("#proj-benefits").innerHTML = data.beneficios.map((b) =>
      `<label><input type="checkbox" value="${esc(b.id)}" ${(p.beneficios || []).includes(b.id) ? "checked" : ""}> ${esc(b.titulo)}</label>`).join("");
    f.classList.remove("hidden");
    f.scrollIntoView({ behavior: "smooth" });
  }

  $("#new-project").addEventListener("click", () => openForm(null));
  $("#proj-cancel").addEventListener("click", () => $("#proj-form").classList.add("hidden"));
  $("#proj-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const f = e.target, el = f.elements;
    const num = (v) => (v === "" ? 0 : Number(v));
    const p = {
      id: editingId || "p" + Date.now().toString(36),
      nombre: el.nombre.value.trim(), inmobiliaria: el.inmobiliaria.value.trim(), comuna: el.comuna.value.trim(),
      direccion: el.direccion.value.trim(), precioDesde: num(el.precioDesde.value),
      dormitorios: el.dormitorios.value.split(/[,\s]+/).map(Number).filter((n) => n > 0),
      tipologias: el.tipologias.value.trim(), entrega: el.entrega.value.trim() || "Consultar",
      bonoPie: num(el.bonoPie.value), descuento: num(el.descuento.value), arriendoEstimado: num(el.arriendoEstimado.value),
      promocion: el.promocion.value.trim(), beneficios: $$("#proj-benefits input:checked").map((c) => c.value),
      imagen: el.imagen.value.trim(), descripcion: el.descripcion.value.trim(),
      destacado: el.destacado.checked, activo: el.activo.checked
    };
    const i = data.proyectos.findIndex((x) => x.id === p.id);
    if (i >= 0) data.proyectos[i] = p; else data.proyectos.unshift(p);
    save("Proyecto guardado");
    f.classList.add("hidden");
    renderProjects();
  });

  $("#proj-rows").addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.edit) openForm(data.proyectos.find((p) => p.id === b.dataset.edit));
    if (b.dataset.dup) {
      const src = data.proyectos.find((p) => p.id === b.dataset.dup);
      data.proyectos.push(Object.assign(JSON.parse(JSON.stringify(src)), { id: "p" + Date.now().toString(36), nombre: src.nombre + " (copia)", activo: false }));
      save("Proyecto duplicado (oculto)"); renderProjects();
    }
    if (b.dataset.del && confirm("¿Eliminar este proyecto?")) {
      data.proyectos = data.proyectos.filter((p) => p.id !== b.dataset.del); save("Proyecto eliminado"); renderProjects();
    }
    if (b.dataset.up) {
      const i = +b.dataset.up; if (i > 0) { [data.proyectos[i - 1], data.proyectos[i]] = [data.proyectos[i], data.proyectos[i - 1]]; save(); renderProjects(); }
    }
  });

  /* Beneficios */
  function renderBenefits() {
    $("#ben-list").innerHTML = data.beneficios.map((b, i) => `
      <div class="panel" style="box-shadow:none;border:1px solid var(--line)">
        <div class="grid-form" data-ben="${i}">
          <div class="field"><label>Título</label><input data-k="titulo" value="${esc(b.titulo)}"></div>
          <div class="field"><label>Ícono</label><select data-k="icono">${["percent", "shield", "gift", "receipt", "home"].map((x) => `<option ${x === b.icono ? "selected" : ""}>${x}</option>`).join("")}</select></div>
          <div class="field chk" style="align-self:end"><label><input type="checkbox" data-k="activo" ${b.activo !== false ? "checked" : ""}> Visible</label></div>
          <div class="field full"><label>Resumen (tarjeta)</label><textarea data-k="resumen" rows="2">${esc(b.resumen)}</textarea></div>
          <div class="field full"><label>Detalle</label><textarea data-k="detalle" rows="2">${esc(b.detalle)}</textarea></div>
          <div class="field full"><label>Requisitos y condiciones vigentes</label><textarea data-k="requisitos" rows="2">${esc(b.requisitos)}</textarea></div>
        </div>
      </div>`).join("");
  }
  $("#ben-list").addEventListener("change", (e) => {
    const box = e.target.closest("[data-ben]"); if (!box) return;
    const b = data.beneficios[+box.dataset.ben], k = e.target.dataset.k;
    b[k] = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    save("Beneficio actualizado");
  });

  /* Perfiles */
  function renderProfiles() {
    $("#perf-list").innerHTML = data.perfiles.map((p, i) => `
      <div class="grid-form" data-perf="${i}" style="padding:14px 0;border-bottom:1px solid var(--line)">
        <div class="field"><label>Título</label><input data-k="titulo" value="${esc(p.titulo)}"></div>
        <div class="field"><label>Etiqueta</label><input data-k="tag" value="${esc(p.tag)}"></div>
        <div class="field full"><label>Texto</label><textarea data-k="texto" rows="2">${esc(p.texto)}</textarea></div>
      </div>`).join("");
  }
  $("#perf-list").addEventListener("change", (e) => {
    const box = e.target.closest("[data-perf]"); if (!box) return;
    data.perfiles[+box.dataset.perf][e.target.dataset.k] = e.target.value; save("Perfil actualizado");
  });

  /* Leads */
  function getLeads() { try { return JSON.parse(localStorage.getItem("avance_leads") || "[]"); } catch (e) { return []; } }
  function renderLeads() {
    const leads = getLeads().slice().reverse();
    $("#lead-rows").innerHTML = leads.length ? leads.map((l) => `<tr><td>${esc(new Date(l.fecha).toLocaleString("es-CL"))}</td><td>${esc(l.nombre)}</td><td>${esc(l.telefono)}</td><td>${esc(l.email)}</td><td>${esc(l.renta)}</td><td>${esc(l.pie)}</td><td>${esc(l.objetivo)}</td><td>${esc(l.proyecto)}</td></tr>`).join("")
      : '<tr><td colspan="8">Sin leads en este navegador.</td></tr>';
  }
  $("#leads-csv").addEventListener("click", () => {
    const cols = ["fecha", "nombre", "telefono", "email", "renta", "pie", "objetivo", "proyecto", "comentario"];
    const csv = [cols.join(";")].concat(getLeads().map((l) => cols.map((c) => `"${String(l[c] ?? "").replace(/"/g, '""')}"`).join(";"))).join("\n");
    download("leads-avance.csv", "﻿" + csv, "text/csv");
  });
  $("#leads-clear").addEventListener("click", () => { if (confirm("¿Borrar los leads guardados en este navegador?")) { localStorage.removeItem("avance_leads"); renderLeads(); } });

  /* Publicar */
  function download(name, content, type) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([content], { type: type + ";charset=utf-8" }));
    a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  $("#upd-date").addEventListener("change", (e) => { data.actualizado = e.target.value; save("Fecha actualizada"); });
  $("#dl-js").addEventListener("click", () => {
    data.actualizado = $("#upd-date").value || new Date().toISOString().slice(0, 10);
    save();
    download("data.js", "/*\n * CONTENIDO ADMINISTRABLE – AVANCE INMOBILIARIO\n * Generado desde admin.html el " + new Date().toLocaleString("es-CL") + "\n */\nwindow.AVANCE_DATA = " + JSON.stringify(data, null, 2) + ";\n", "text/javascript");
    toast("data.js descargado: súbelo a assets/js/");
  });
  $("#dl-json").addEventListener("click", () => download("avance-contenido.json", JSON.stringify(data, null, 2), "application/json"));
  $("#imp-json").addEventListener("change", (e) => {
    const file = e.target.files[0]; if (!file) return;
    file.text().then((t) => {
      const d = JSON.parse(t);
      if (!Array.isArray(d.proyectos) || !Array.isArray(d.beneficios)) throw new Error("Formato inválido");
      data = d; save("Contenido importado"); renderAll();
    }).catch((err) => alert("No se pudo importar: " + err.message));
  });
  $("#discard").addEventListener("click", () => {
    if (!confirm("¿Descartar los cambios locales y volver al contenido publicado?")) return;
    localStorage.removeItem(KEY);
    data = JSON.parse(JSON.stringify(window.AVANCE_DATA));
    renderAll(); toast("Cambios locales descartados");
  });
})();
