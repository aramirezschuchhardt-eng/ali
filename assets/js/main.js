/* AVANCE INMOBILIARIO – lógica del sitio */
(function () {
  "use strict";

  const CFG = window.AVANCE_CONFIG || {};
  let DATA = window.AVANCE_DATA || { beneficios: [], perfiles: [], proyectos: [] };

  // Vista previa del panel de administración (sólo en el navegador del administrador)
  try {
    const preview = localStorage.getItem("avance_data_preview");
    if (preview) {
      DATA = JSON.parse(preview);
      const bar = document.createElement("div");
      bar.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:80;background:#F16528;color:#1F1B18;padding:8px 16px;font:600 13px Inter,sans-serif;text-align:center";
      bar.innerHTML = 'Vista previa local de cambios del panel. Publica descargando <code>data.js</code>. <a href="admin.html" style="color:inherit">Volver al panel</a>';
      document.body.appendChild(bar);
    }
  } catch (e) { /* sin acceso a localStorage */ }

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const nf0 = new Intl.NumberFormat("es-CL", { maximumFractionDigits: 0 });
  const nf1 = new Intl.NumberFormat("es-CL", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const nf2 = new Intl.NumberFormat("es-CL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const clp = (n) => (n < 0 ? "−$" : "$") + nf0.format(Math.abs(Math.round(n)));
  const uf = (n) => "UF " + nf0.format(n);
  const ufDec = (n) => "UF " + nf2.format(n);
  const pct = (n) => nf1.format(n) + "%";
  let valorUF = Number(CFG.valorUF) || 40000;

  const ICONS = {
    percent: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M19 5L5 19"/><circle cx="7" cy="7" r="2.5"/><circle cx="17" cy="17" r="2.5"/></svg>',
    shield: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6l8-3z"/><path d="M8.5 12l2.5 2.5 4.5-5"/></svg>',
    gift: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="3" y="8" width="18" height="5" rx="1"/><path d="M5 13v8h14v-8M12 8v13M12 8c-2-4-6-4-6-1.5S10 8 12 8zm0 0c2-4 6-4 6-1.5S14 8 12 8z"/></svg>',
    receipt: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2V3z"/><path d="M9 8h6M9 12h6M9 16h3"/></svg>',
    home: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1v-9z"/></svg>'
  };
  const pin = '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M12 2a7 7 0 00-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 00-7-7zm0 9.5A2.5 2.5 0 1112 6a2.5 2.5 0 010 5.5z"/></svg>';

  const benefitById = Object.fromEntries((DATA.beneficios || []).map((b) => [b.id, b]));
  const benefitName = (id) => (benefitById[id] ? benefitById[id].titulo : id);

  /* ---------- WhatsApp / contacto ---------- */
  const waLink = (msg) => `https://wa.me/${encodeURIComponent(CFG.whatsapp || "")}?text=${encodeURIComponent(msg || CFG.whatsappMensaje || "")}`;
  const agendaLink = () => CFG.agendaUrl || waLink("Hola Avance Inmobiliario, quiero agendar una reunión con un asesor.");
  function setupContactLinks() {
    $("#wa-float").href = waLink();
    $("#wa-cta").href = waLink();
    $("#agenda-cta").href = agendaLink();
    const em = $("#ft-email"); em.textContent = CFG.email || ""; em.href = "mailto:" + (CFG.email || "");
    const tl = $("#ft-tel"); tl.textContent = CFG.telefono || ""; tl.href = "tel:" + String(CFG.telefono || "").replace(/\s/g, "");
    $("#ft-dir").textContent = CFG.direccion || "";
    $("#ft-social").innerHTML = [["Instagram", CFG.instagram], ["Facebook", CFG.facebook], ["LinkedIn", CFG.linkedin]]
      .filter(([, url]) => url).map(([n, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${n}</a>`).join(" · ");
    $("#year").textContent = new Date().getFullYear();
    $("#updated").textContent = DATA.actualizado ? new Date(DATA.actualizado + "T12:00:00").toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" }) : "";
  }

  /* ---------- Header / menú ---------- */
  function setupHeader() {
    const header = $(".header");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 40);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const burger = $("#burger"), nav = $("#nav");
    burger.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    $$("#nav a").forEach((a) => a.addEventListener("click", () => { nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false"); }));
  }

  function setupHeroSlider() {
    const slides = $$(".hero__slide");
    if (slides.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    setInterval(() => { slides[i].classList.remove("is-active"); i = (i + 1) % slides.length; slides[i].classList.add("is-active"); }, 6500);
  }

  /* ---------- Beneficios y perfiles ---------- */
  function renderBenefits() {
    $("#benefits-grid").innerHTML = (DATA.beneficios || []).filter((b) => b.activo !== false).map((b) => `
      <article class="benefit reveal">
        <div class="benefit__icon">${ICONS[b.icono] || ICONS.home}</div>
        <h3>${esc(b.titulo)}</h3>
        <p>${esc(b.resumen)}</p>
        <details><summary>Requisitos y condiciones</summary><p>${esc(b.detalle)}</p><p><strong>Condiciones:</strong> ${esc(b.requisitos)}</p></details>
        <a href="#contacto" class="btn btn--navy btn--sm" data-objetivo="Evaluación: ${esc(b.titulo)}">Solicitar evaluación</a>
      </article>`).join("");
  }

  function renderProfiles() {
    $("#profiles-grid").innerHTML = (DATA.perfiles || []).map((p) => `
      <article class="profile reveal">
        <span class="tag">${esc(p.tag)}</span>
        <h4>${esc(p.titulo)}</h4>
        <p>${esc(p.texto)}</p>
        <a href="#contacto" data-objetivo="${esc(p.titulo)}">Diseñar esta estrategia →</a>
      </article>`).join("");
  }

  /* ---------- Catálogo ---------- */
  const proyectos = () => (DATA.proyectos || []).filter((p) => p.activo !== false);
  const rentBruta = (p) => (p.precioDesde > 0 ? (p.arriendoEstimado * 12) / (p.precioDesde * valorUF) * 100 : 0);

  function fillFilterOptions() {
    const list = proyectos();
    const comunas = [...new Set(list.map((p) => p.comuna))].sort((a, b) => a.localeCompare(b, "es"));
    const entregas = [...new Set(list.map((p) => String(p.entrega)))].sort((a, b) => (a === "Inmediata" ? -1 : b === "Inmediata" ? 1 : a.localeCompare(b)));
    $("#f-comuna").insertAdjacentHTML("beforeend", comunas.map((c) => `<option>${esc(c)}</option>`).join(""));
    $("#f-entrega").insertAdjacentHTML("beforeend", entregas.map((c) => `<option>${esc(c)}</option>`).join(""));
    $("#f-beneficio").insertAdjacentHTML("beforeend", (DATA.beneficios || []).map((b) => `<option value="${esc(b.id)}">${esc(b.titulo)}</option>`).join(""));
  }

  function renderProjects() {
    const f = Object.fromEntries(new FormData($("#filters")));
    let list = proyectos().filter((p) =>
      (!f.comuna || p.comuna === f.comuna) &&
      (!f.precio || p.precioDesde <= Number(f.precio)) &&
      (!f.dorm || (p.dormitorios || []).includes(Number(f.dorm))) &&
      (!f.entrega || String(p.entrega) === f.entrega) &&
      (!f.beneficio || (p.beneficios || []).includes(f.beneficio))
    );
    const sorters = {
      "destacados": (a, b) => (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0),
      "precio-asc": (a, b) => a.precioDesde - b.precioDesde,
      "rent-desc": (a, b) => rentBruta(b) - rentBruta(a),
      "bono-desc": (a, b) => (b.bonoPie || 0) - (a.bonoPie || 0)
    };
    list.sort(sorters[f.orden] || sorters.destacados);

    $("#results-count").textContent = `${list.length} ${list.length === 1 ? "proyecto encontrado" : "proyectos encontrados"}`;
    $("#projects-grid").innerHTML = list.length ? list.map(cardHTML).join("") :
      `<div class="empty"><p><strong>No hay proyectos con esos filtros.</strong></p><p>Cuéntanos qué buscas y te enviamos alternativas que no están publicadas.</p><a href="#contacto" class="btn btn--gold btn--sm">Buscar por mí</a></div>`;
    observeReveal();
  }

  function cardHTML(p) {
    const badges = [];
    if (p.bonoPie) badges.push(`<span class="badge">Bono pie ${p.bonoPie}%</span>`);
    if (p.descuento) badges.push(`<span class="badge badge--white">${p.descuento}% dcto.</span>`);
    badges.push(`<span class="badge badge--navy">Entrega ${esc(p.entrega)}</span>`);
    const dorms = (p.dormitorios || []).join(", ");
    return `
      <article class="card reveal">
        <div class="card__media">
          <img src="${esc(p.imagen)}" alt="${esc(p.nombre)} en ${esc(p.comuna)}" loading="lazy" width="600" height="375" onerror="this.style.display='none'">
          <div class="badges">${badges.join("")}</div>
        </div>
        <div class="card__body">
          <p class="card__loc">${pin} ${esc(p.comuna)} · ${esc(p.direccion)}</p>
          <h3>${esc(p.nombre)}</h3>
          <p class="card__typ">${esc(p.tipologias)}</p>
          <div class="card__grid">
            <div class="card__price"><span>Desde</span><strong>${uf(p.precioDesde)}</strong></div>
            <div><span>Dormitorios</span><strong>${esc(dorms)}</strong></div>
            <div><span>Arriendo estimado</span><strong>${clp(p.arriendoEstimado)}</strong></div>
            <div><span>Rentab. bruta est.</span><strong>${pct(rentBruta(p))}</strong></div>
          </div>
          ${p.promocion ? `<p class="card__promo">★ ${esc(p.promocion)} <small>(sujeto a stock y condiciones)</small></p>` : ""}
          <div class="card__actions">
            <button type="button" class="btn btn--line" data-detail="${esc(p.id)}">Ver detalles</button>
            <a href="#contacto" class="btn btn--gold" data-proyecto="${esc(p.nombre)}">Asesoría</a>
          </div>
        </div>
      </article>`;
  }

  function openProject(id) {
    const p = proyectos().find((x) => x.id === id);
    if (!p) return;
    const modal = $("#project-modal");
    $("#pm-body").innerHTML = `
      <img class="pm__img" src="${esc(p.imagen)}" alt="${esc(p.nombre)}" onerror="this.style.display='none'">
      <div class="pm__content">
        <p class="card__loc">${pin} ${esc(p.comuna)} · ${esc(p.direccion)}</p>
        <h3 id="pm-title">${esc(p.nombre)}</h3>
        <p class="lead">${esc(p.descripcion)}</p>
        <div class="pm__facts">
          <div><span>Precio desde</span><strong>${uf(p.precioDesde)}</strong><br><small>≈ ${clp(p.precioDesde * valorUF)}</small></div>
          <div><span>Tipologías</span><strong>${esc(p.tipologias)}</strong></div>
          <div><span>Entrega</span><strong>${esc(p.entrega)}</strong></div>
          <div><span>Inmobiliaria</span><strong>${esc(p.inmobiliaria)}</strong></div>
          <div><span>Bono pie</span><strong>${p.bonoPie ? p.bonoPie + "%" : "—"}</strong></div>
          <div><span>Descuento</span><strong>${p.descuento ? p.descuento + "%" : "—"}</strong></div>
          <div><span>Arriendo estimado</span><strong>${clp(p.arriendoEstimado)}</strong></div>
          <div><span>Rentab. bruta est.</span><strong>${pct(rentBruta(p))}</strong></div>
        </div>
        ${p.promocion ? `<p class="card__promo">★ Promoción: ${esc(p.promocion)}</p>` : ""}
        <div class="pm__benefits">${(p.beneficios || []).map((b) => `<span class="badge badge--navy">${esc(benefitName(b))}</span>`).join("")}</div>
        <div class="pm__actions">
          <button type="button" class="btn btn--line" data-simular="${esc(p.id)}">Simular inversión</button>
          <a href="#contacto" class="btn btn--gold" data-proyecto="${esc(p.nombre)}" data-close>Solicitar asesoría</a>
          <a href="${waLink("Hola, quiero información del proyecto " + p.nombre + " (" + p.comuna + ").")}" class="btn btn--wa" target="_blank" rel="noopener">WhatsApp</a>
        </div>
        <p class="disclaimer disclaimer--sm">Valores referenciales sujetos a disponibilidad y cambios de la inmobiliaria. Arriendo y rentabilidad estimados, no garantizados. Conversión a pesos con UF ${clp(valorUF)}.</p>
      </div>`;
    if (typeof modal.showModal === "function") modal.showModal(); else modal.setAttribute("open", "");
  }

  function closeModal() { const m = $("#project-modal"); if (m.open) (m.close ? m.close() : m.removeAttribute("open")); }

  /* ---------- Simulador ---------- */
  const S = {
    precio: $("#s-precio"), pie: $("#s-pie"), bono: $("#s-bono"), cuotas: $("#s-cuotas"),
    tasa: $("#s-tasa"), plazo: $("#s-plazo"), arriendo: $("#s-arriendo"), gastos: $("#s-gastos"), uf: $("#s-uf")
  };

  function simulate() {
    const precio = Math.max(0, +S.precio.value || 0);
    let piePct = +S.pie.value || 0;
    let bonoPct = +S.bono.value || 0;
    if (bonoPct > piePct) { piePct = bonoPct; S.pie.value = piePct; }
    const cuotas = Math.min(72, Math.max(1, Math.round(+S.cuotas.value || 1)));
    const tasa = +S.tasa.value || 0;
    const anios = +S.plazo.value || 30;
    const arriendo = Math.max(0, +S.arriendo.value || 0);
    const gastos = Math.max(0, +S.gastos.value || 0);
    valorUF = Math.max(1, +S.uf.value || valorUF);

    $("#o-pie").textContent = piePct + "%";
    $("#o-bono").textContent = bonoPct + "%";
    $("#o-tasa").textContent = nf2.format(tasa) + "%";

    const pieUF = precio * piePct / 100;
    const bonoUF = precio * bonoPct / 100;
    const pieClienteUF = Math.max(0, pieUF - bonoUF);
    const creditoUF = precio - pieUF;
    const r = tasa / 100 / 12, n = anios * 12;
    const divUF = creditoUF <= 0 ? 0 : r === 0 ? creditoUF / n : creditoUF * r / (1 - Math.pow(1 + r, -n));
    const divCLP = divUF * valorUF;
    const cuotaPie = pieClienteUF * valorUF / cuotas;
    const flujo = arriendo - divCLP - gastos;
    const precioCLP = precio * valorUF;
    const rb = precioCLP > 0 ? arriendo * 12 / precioCLP * 100 : 0;
    const rn = precioCLP > 0 ? (arriendo - gastos) * 12 / precioCLP * 100 : 0;

    $("#r-dividendo").textContent = clp(divCLP);
    $("#r-dividendo-uf").textContent = `${ufDec(divUF)} mensuales · ${anios} años`;
    $("#r-pie").textContent = clp(pieClienteUF * valorUF);
    $("#r-pie-uf").textContent = `${ufDec(pieClienteUF)} (pie ${piePct}% − bono ${bonoPct}%)`;
    $("#r-cuota").textContent = clp(cuotaPie);
    $("#r-cuota-n").textContent = `${cuotas} cuotas`;
    $("#r-credito").textContent = uf(creditoUF);
    $("#r-credito-clp").textContent = `≈ ${clp(creditoUF * valorUF)} (${100 - piePct}% del precio)`;
    const fEl = $("#r-flujo"); fEl.textContent = clp(flujo); fEl.className = flujo >= 0 ? "pos" : "neg";
    $("#r-rent").textContent = pct(rb);
    $("#r-cap").textContent = pct(rn);
    $("#r-msg").textContent = flujo >= 0
      ? "Según esta estimación, el arriendo cubriría el dividendo y los gastos. Valida con un asesor las tasas reales disponibles para tu perfil."
      : `Según esta estimación, tendrías que complementar ${clp(-flujo)} al mes. Podemos buscar alternativas de tasa, plazo, pie o proyecto para mejorar tu flujo.`;
    window.__lastSim = { precio, piePct, bonoPct, tasa, anios, arriendo, divCLP: Math.round(divCLP), flujo: Math.round(flujo) };
  }

  function setupSimulator() {
    S.uf.value = valorUF;
    Object.values(S).forEach((el) => el.addEventListener("input", simulate));
    simulate();
  }

  function loadProjectInSim(id) {
    const p = proyectos().find((x) => x.id === id);
    if (!p) return;
    S.precio.value = p.precioDesde;
    S.bono.value = Math.min(25, p.bonoPie || 0);
    if (+S.pie.value < +S.bono.value) S.pie.value = Math.max(20, S.bono.value);
    S.arriendo.value = p.arriendoEstimado;
    simulate();
    closeModal();
    $("#simulador").scrollIntoView({ behavior: "smooth" });
  }

  /* ---------- Formulario de captación ---------- */
  function preset(objetivo, proyecto) {
    if (objetivo) {
      const sel = $("#l-objetivo");
      const opt = $$("option", sel).find((o) => o.value === objetivo);
      if (opt) sel.value = objetivo;
      else { const c = $("#l-comentario"); if (!c.value) c.value = objetivo; }
    }
    if (proyecto) {
      $("#l-proyecto").value = proyecto;
      const c = $("#l-comentario"); c.value = `Me interesa el proyecto ${proyecto}.`;
    }
  }

  function setupForm() {
    const form = $("#lead-form"), msg = $("#form-msg");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.className = "form-msg"; msg.textContent = "";
      if (form.empresa.value) return; // honeypot anti-spam
      let ok = true;
      $$(".field", form).forEach((f) => {
        const input = $("input, select", f);
        if (!input || !input.required) return;
        let valid = input.value.trim() !== "";
        if (input.type === "email") valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
        if (input.type === "tel") valid = input.value.replace(/\D/g, "").length >= 8;
        f.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) { msg.className = "form-msg err"; msg.textContent = "Revisa los campos marcados."; return; }
      if (!$("#l-consent").checked) { msg.className = "form-msg err"; msg.textContent = "Debes aceptar ser contactado para continuar."; return; }

      const lead = Object.fromEntries(new FormData(form));
      delete lead.empresa;
      Object.assign(lead, {
        fecha: new Date().toISOString(),
        origen: "web",
        pagina: location.href,
        utm: Object.fromEntries(new URLSearchParams(location.search)),
        simulacion: window.__lastSim || null
      });

      const btn = $("button[type=submit]", form);
      btn.disabled = true; btn.textContent = "Enviando…";
      let sent = false;
      if (CFG.crmWebhook) {
        try {
          // text/plain evita la solicitud preflight CORS; Zapier/Make/n8n interpretan el JSON igualmente
          const res = await fetch(CFG.crmWebhook, { method: "POST", headers: { "Content-Type": "text/plain;charset=UTF-8" }, body: JSON.stringify(lead) });
          sent = res.ok || res.type === "opaque";
        } catch (err) { sent = false; }
      }
      try { const arr = JSON.parse(localStorage.getItem("avance_leads") || "[]"); arr.push(lead); localStorage.setItem("avance_leads", JSON.stringify(arr)); } catch (err) { /* noop */ }
      (window.dataLayer = window.dataLayer || []).push({ event: "generate_lead", objetivo: lead.objetivo });

      const waText = `Hola, soy ${lead.nombre}. Quiero asesoría de inversión.\nObjetivo: ${lead.objetivo}\nRenta: ${lead.renta}\nPie disponible: ${lead.pie}${lead.proyecto ? "\nProyecto: " + lead.proyecto : ""}\nTeléfono: ${lead.telefono}\nCorreo: ${lead.email}`;
      btn.disabled = false; btn.textContent = "Quiero mi asesoría gratuita";
      if (sent) {
        msg.className = "form-msg ok";
        msg.innerHTML = `¡Gracias, ${esc(lead.nombre.split(" ")[0])}! Un asesor te contactará pronto. ¿Quieres adelantar? <a href="${agendaLink()}" target="_blank" rel="noopener">Agenda una reunión</a> o <a href="${waLink(waText)}" target="_blank" rel="noopener">escríbenos por WhatsApp</a>.`;
        form.reset();
      } else {
        msg.className = "form-msg ok";
        msg.innerHTML = `¡Gracias! Para completar tu solicitud, <a href="${waLink(waText)}" target="_blank" rel="noopener">envíanos tus datos por WhatsApp</a> o <a href="${agendaLink()}" target="_blank" rel="noopener">agenda una reunión</a>.`;
        window.open(waLink(waText), "_blank", "noopener");
      }
    });
  }

  /* ---------- Delegación de eventos ---------- */
  function setupEvents() {
    $("#filters").addEventListener("change", renderProjects);
    $("#filters").addEventListener("reset", () => setTimeout(renderProjects));
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-detail],[data-simular],[data-objetivo],[data-proyecto],[data-interes],[data-close]");
      if (!t) return;
      if (t.dataset.detail) { openProject(t.dataset.detail); return; }
      if (t.dataset.simular) { loadProjectInSim(t.dataset.simular); return; }
      if (t.dataset.objetivo || t.dataset.proyecto) preset(t.dataset.objetivo, t.dataset.proyecto);
      if (t.dataset.interes) { $("#l-objetivo").value = "Quiero invertir"; $("#l-comentario").value = `Me interesan oportunidades: ${t.dataset.interes}.`; }
      if (t.hasAttribute("data-close")) closeModal();
    });
    $("#sim-lead").addEventListener("click", () => {
      const s = window.__lastSim; if (!s) return;
      $("#l-comentario").value = `Simulación: depto UF ${s.precio}, pie ${s.piePct}%, bono ${s.bonoPct}%, tasa ${s.tasa}%, ${s.anios} años, arriendo ${clp(s.arriendo)}, dividendo ${clp(s.divCLP)}.`;
    });
    $("#project-modal").addEventListener("click", (e) => { if (e.target.id === "project-modal") closeModal(); });
  }

  /* ---------- Reveal on scroll ---------- */
  let io;
  function observeReveal() {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((el) => el.classList.add("is-visible")); return; }
    io = io || new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }), { threshold: 0.12 });
    $$(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
  }

  /* ---------- Init ---------- */
  setupContactLinks();
  setupHeader();
  setupHeroSlider();
  renderBenefits();
  renderProfiles();
  if (proyectos().length) {
    // El catálogo sólo aparece cuando hay proyectos publicados desde el panel
    $("#proyectos").hidden = false;
    fillFilterOptions();
    renderProjects();
  }
  setupSimulator();
  setupForm();
  setupEvents();
  observeReveal();
})();
