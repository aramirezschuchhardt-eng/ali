const pptxgen = require("pptxgenjs");
const p = new pptxgen();
p.layout = "LAYOUT_WIDE";           // 13.3 x 7.5
const W = 13.3, H = 7.5;

// ---- paleta: mundo del plano técnico + valle del Maule ----
const INK   = "12212B";   // grafito azulado (dominante en slides oscuras)
const INK2  = "1B2F3D";
const PAPER = "F1F2EE";   // papel de plano
const CARD  = "FFFFFF";
const BLUE  = "2C5D7C";   // azul de delineado
const BLUEL = "7FB0D0";
const OCHRE = "B07D2B";   // señal / corrección
const GREEN = "3E6B4A";
const RED   = "9C3B2E";
const MUT   = "5A6670";
const MUTL  = "A9B4BC";

const SER = "Cambria", SANS = "Calibri";

const sh = () => ({ type: "outer", color: "8A9299", blur: 10, offset: 2, angle: 90, opacity: 0.22 });

function darkSlide() {
  const s = p.addSlide();
  s.background = { color: INK };
  return s;
}
function lightSlide(title, kicker) {
  const s = p.addSlide();
  s.background = { color: PAPER };
  if (kicker) s.addText(kicker.toUpperCase(), {
    x: 0.62, y: 0.34, w: 9, h: 0.26, fontFace: SANS, fontSize: 11, bold: true,
    charSpacing: 2.2, color: BLUE, margin: 0
  });
  if (title) s.addText(title, {
    x: 0.6, y: 0.68, w: 12.1, h: 0.76, fontFace: SER, fontSize: 31, bold: true,
    color: INK, margin: 0
  });
  return s;
}
// tarjeta = tinte suave + sombra (motivo repetido en todo el deck)
function card(s, x, y, w, h, fill) {
  s.addShape(p.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06, fill: { color: fill || CARD }, shadow: sh(), line: { color: "E2E5DE", width: 0.5 }
  });
}
function stat(s, x, y, w, value, label, color, sub) {
  s.addText(value, { x, y, w, h: 0.55, fontFace: SANS, fontSize: 30, bold: true, color: color || INK, margin: 0 });
  s.addText(label.toUpperCase(), { x, y: y + 0.56, w, h: 0.26, fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 1.4, color: MUT, margin: 0 });
  if (sub) s.addText(sub, { x, y: y + 0.85, w, h: 0.6, fontFace: SANS, fontSize: 11.5, color: MUT, lineSpacing: 16, margin: 0 });
}
function tbl(s, rows, opts) {
  s.addTable(rows, Object.assign({
    fontFace: SANS, fontSize: 12, color: INK, border: { type: "solid", color: "DCE0D8", pt: 0.5 },
    align: "right", valign: "middle", autoPage: false
  }, opts));
}
const hdr = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: BLUE }, fontSize: 11, align: "center" } });
const hdrL = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: BLUE }, fontSize: 11, align: "left" } });
const L = (t, o) => ({ text: t, options: Object.assign({ align: "left" }, o || {}) });

// ══════════════════ 1 · PORTADA ══════════════════
{
  const s = darkSlide();
  s.addText("EVALUACIÓN DE INVERSIÓN · REVISIÓN 2 · AGOSTO 2026", {
    x: 0.85, y: 1.35, w: 11, h: 0.3, fontFace: SANS, fontSize: 12, bold: true, charSpacing: 2.4, color: BLUEL, margin: 0
  });
  s.addText("Loteo 19,26 hectáreas\nAvenida San Miguel 6850, Talca", {
    x: 0.8, y: 1.9, w: 11.6, h: 1.9, fontFace: SER, fontSize: 44, bold: true, color: "FFFFFF", lineSpacing: 52, margin: 0
  });
  s.addText("Compra del terreno, loteo de 90 sitios y masterplan por etapas", {
    x: 0.85, y: 3.95, w: 10.5, h: 0.45, fontFace: SER, fontSize: 19, italic: true, color: MUTL, margin: 0
  });
  const items = [["119.000 UF", "Precio del paño"], ["90", "Sitios de 1.421 m²"], ["42,7%", "TIR escenario base"], ["67.000 UF", "Capital máximo"]];
  items.forEach(([v, l], i) => {
    const x = 0.85 + i * 2.95;
    s.addText(v, { x, y: 5.15, w: 2.7, h: 0.6, fontFace: SANS, fontSize: 26, bold: true, color: "FFFFFF", margin: 0 });
    s.addText(l.toUpperCase(), { x, y: 5.78, w: 2.7, h: 0.3, fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 1.4, color: BLUEL, margin: 0 });
  });
  s.addText("Roles 3721-2 y 3721-12 · Sector Santa Elena de Huilquilemu · Región del Maule", {
    x: 0.85, y: 6.65, w: 11, h: 0.3, fontFace: SANS, fontSize: 11, color: MUT, margin: 0
  });
  s.addNotes("Presentación de la revisión 2, que incorpora las láminas L_04 a L_09 y el resumen de costos de urbanización entregado por el mandante.");
}

// ══════════════════ 2 · VEREDICTO ══════════════════
{
  const s = darkSlide();
  s.addText("EL VEREDICTO", { x: 0.8, y: 0.55, w: 8, h: 0.3, fontFace: SANS, fontSize: 11, bold: true, charSpacing: 2.4, color: BLUEL, margin: 0 });
  s.addText("Comprar. El precio no está en discusión.", {
    x: 0.78, y: 0.92, w: 11.8, h: 0.75, fontFace: SER, fontSize: 36, bold: true, color: "FFFFFF", margin: 0
  });
  const c = [
    ["119.000 UF", "Precio pedido", "0,62 UF/m² del paño"],
    ["298.000 UF", "Valor residual", "a TIR objetivo de 18%"],
    ["44 sitios", "Punto de equilibrio", "la mitad del inventario"],
    ["Año 3", "Recuperación", "el flujo vuelve a cero"]
  ];
  c.forEach(([v, l, sub], i) => {
    const x = 0.8 + i * 3.05;
    s.addShape(p.ShapeType.roundRect, { x, y: 2.1, w: 2.8, h: 2.0, rectRadius: 0.06, fill: { color: INK2 }, line: { color: "2E4657", width: 0.75 } });
    s.addText(v, { x: x + 0.22, y: 2.32, w: 2.4, h: 0.55, fontFace: SANS, fontSize: 23, bold: true, color: "FFFFFF", margin: 0 });
    s.addText(l.toUpperCase(), { x: x + 0.22, y: 2.9, w: 2.4, h: 0.28, fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 1.3, color: BLUEL, margin: 0 });
    s.addText(sub, { x: x + 0.22, y: 3.25, w: 2.45, h: 0.62, fontFace: SANS, fontSize: 11, color: MUTL, margin: 0 });
  });
  s.addText([
    { text: "Lo que cambió: ", options: { bold: true, color: "FFFFFF" } },
    { text: "con el costo de urbanización corregido, este deja de ser un negocio ajustado que hay que estructurar con cuidado y pasa a ser un buen negocio que hay que ejecutar rápido. El riesgo ya no está en el precio ni en el plazo: está en que el presupuesto de urbanización sea real y en que exista factibilidad sanitaria.", options: { color: MUTL } }
  ], { x: 0.8, y: 4.55, w: 11.7, h: 1.5, fontFace: SANS, fontSize: 15, lineSpacing: 24, margin: 0 });
  s.addNotes("Mensaje central: el análisis se movió de 'apretado' a 'bueno' por una sola variable, la urbanización.");
}

// ══════════════════ 3 · LA CORRECCIÓN ══════════════════
{
  const s = lightSlide("Corrijo mi estimación de urbanización", "La corrección que cambia todo");
  card(s, 0.6, 1.65, 5.85, 2.15, "F6E9DC");
  s.addText("ESTIMACIÓN ANTERIOR", { x: 0.95, y: 1.9, w: 5, h: 0.28, fontFace: SANS, fontSize: 10, bold: true, charSpacing: 1.6, color: OCHRE, margin: 0 });
  s.addText("135.000 – 185.000 UF", { x: 0.95, y: 2.2, w: 5.2, h: 0.62, fontFace: SANS, fontSize: 30, bold: true, color: OCHRE, margin: 0 });
  s.addText("Construida sobre valores por metro lineal de vialidad urbana, sin el presupuesto real del proyecto.", { x: 0.95, y: 2.9, w: 5.2, h: 0.75, fontFace: SANS, fontSize: 12.5, color: MUT, margin: 0 });

  card(s, 6.85, 1.65, 5.85, 2.15, "E4EBE2");
  s.addText("RANGO RECONSTRUIDO", { x: 7.2, y: 1.9, w: 5, h: 0.28, fontFace: SANS, fontSize: 10, bold: true, charSpacing: 1.6, color: GREEN, margin: 0 });
  s.addText("38.000 – 69.000 UF", { x: 7.2, y: 2.2, w: 5.2, h: 0.62, fontFace: SANS, fontSize: 30, bold: true, color: GREEN, margin: 0 });
  s.addText("Partiendo del resumen por kilómetro entregado, corregido por longitud real y partidas omitidas.", { x: 7.2, y: 2.9, w: 5.2, h: 0.75, fontFace: SANS, fontSize: 12.5, color: MUT, margin: 0 });

  s.addText("Mi estimación estaba entre 2,3 y 2,6 veces alta.", {
    x: 0.6, y: 4.0, w: 12.1, h: 0.5, fontFace: SER, fontSize: 24, bold: true, color: INK, margin: 0
  });
  s.addText("La razón es estructural: los sitios son enormes —1.421 m² promedio—, de modo que hay muy pocos metros de calle por metro cuadrado vendido. La urbanización sale a 0,30–0,54 UF por m² vendible; en un loteo de sitios de 300 m² sale tres o cuatro veces más.", {
    x: 0.62, y: 4.55, w: 12.05, h: 0.9, fontFace: SANS, fontSize: 14.5, color: MUT, lineSpacing: 22, margin: 0
  });
  const impact = [["TIR base", "20,0%", "42,7%"], ["Margen neto", "25,6%", "39,5%"], ["Equilibrio", "64 sitios", "44 sitios"], ["Capital máximo", "110.000 UF", "67.000 UF"]];
  impact.forEach(([k, a, b], i) => {
    const x = 0.6 + i * 3.06;
    card(s, x, 5.6, 2.86, 1.32);
    s.addText(k.toUpperCase(), { x: x + 0.2, y: 5.75, w: 2.5, h: 0.26, fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 1.2, color: MUT, margin: 0 });
    s.addText(a, { x: x + 0.2, y: 6.04, w: 2.5, h: 0.26, fontFace: SANS, fontSize: 12, color: MUT, strike: true, margin: 0 });
    s.addText("→ " + b, { x: x + 0.2, y: 6.3, w: 2.5, h: 0.4, fontFace: SANS, fontSize: 17, bold: true, color: GREEN, margin: 0 });
  });
  s.addNotes("Ser explícito con la corrección propia. Es el hallazgo más importante de esta revisión.");
}

// ══════════════════ 4 · QUÉ COMPRAMOS ══════════════════
{
  const s = lightSlide("Lo que dicen los planos, medido", "01 · Datos duros");
  s.addText("Cifras tomadas de los cuadros de superficies de las láminas L_02, L_03, L_05 y L_09. Se sumaron los 90 registros del listado de lotes.", {
    x: 0.62, y: 1.5, w: 12.05, h: 0.4, fontFace: SANS, fontSize: 13.5, color: MUT, margin: 0
  });
  tbl(s, [
    [hdrL("Partida"), hdr("Superficie (m²)"), hdr("% del paño"), hdrL("Destino")],
    [L("90 sitios (Lote A1)"), "127.866", "66,4%", L("Venta — Etapa 1")],
    [L("Vialidad interior + expropiación"), "27.958", "14,5%", L("Costo de urbanización")],
    [L("Paño colegio"), "18.619", "9,7%", L("Etapa 3 — colegio o estación de servicio")],
    [L("Áreas verdes"), "13.798", "7,2%", L("Costo y plusvalía")],
    [L("Equipamiento comercial"), "4.386", "2,3%", L("Etapa 2 — locales y pádel")],
    [L("Paño fusionado", { bold: true }), { text: "192.627", options: { bold: true } }, { text: "100%", options: { bold: true } }, L("19,2627 ha", { bold: true })]
  ], { x: 0.6, y: 2.05, w: 12.1, colW: [4.0, 2.2, 1.7, 4.2], rowH: 0.4, fill: { color: CARD } });

  const facts = [
    ["Sitio promedio", "1.421 m²", "rango 1.400 – 1.590"],
    ["Régimen", "Condominio tipo B", "calles y áreas verdes comunes"],
    ["Equipamiento comercial", "729,7 m²", "619 arrendables + 4 canchas de pádel"],
    ["Colegio proyectado", "3.849 m²", "cerrados + 2.088 de patio techado, 980 alumnos"]
  ];
  facts.forEach(([k, v, sub], i) => {
    const x = 0.6 + i * 3.06;
    card(s, x, 5.35, 2.86, 1.6);
    s.addText(k.toUpperCase(), { x: x + 0.2, y: 5.52, w: 2.5, h: 0.26, fontFace: SANS, fontSize: 9, bold: true, charSpacing: 1.2, color: BLUE, margin: 0 });
    s.addText(v, { x: x + 0.2, y: 5.8, w: 2.55, h: 0.42, fontFace: SANS, fontSize: 17, bold: true, color: INK, margin: 0 });
    s.addText(sub, { x: x + 0.2, y: 6.24, w: 2.55, h: 0.62, fontFace: SANS, fontSize: 10.5, color: MUT, margin: 0 });
  });
}

// ══════════════════ 5 · URBANIZACIÓN RECONSTRUIDA ══════════════════
{
  const s = lightSlide("El presupuesto entregado, reconstruido", "02 · Urbanización");
  s.addText("El resumen estima $377 a $678 millones por kilómetro. Tiene dos problemas que corregir antes de usarlo.", {
    x: 0.62, y: 1.5, w: 12.05, h: 0.35, fontFace: SANS, fontSize: 13.5, color: MUT, margin: 0
  });
  card(s, 0.6, 1.98, 6.0, 1.5, "F6E9DC");
  s.addText("PROBLEMA 1", { x: 0.92, y: 2.16, w: 5.4, h: 0.26, fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 1.5, color: OCHRE, margin: 0 });
  s.addText("El loteo no tiene 1 km de calles, tiene 2", { x: 0.92, y: 2.42, w: 5.4, h: 0.35, fontFace: SANS, fontSize: 15.5, bold: true, color: INK, margin: 0 });
  s.addText("26.114 m² de vialidad con perfiles de 18 y 11 m dan ~2.000 metros lineales. El presupuesto se multiplica por dos.", { x: 0.92, y: 2.78, w: 5.45, h: 0.6, fontFace: SANS, fontSize: 11.5, color: MUT, margin: 0 });

  card(s, 6.85, 1.98, 5.85, 1.5, "F6E9DC");
  s.addText("PROBLEMA 2", { x: 7.17, y: 2.16, w: 5.2, h: 0.26, fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 1.5, color: OCHRE, margin: 0 });
  s.addText("Faltan siete partidas completas", { x: 7.17, y: 2.42, w: 5.2, h: 0.35, fontFace: SANS, fontSize: 15.5, bold: true, color: INK, margin: 0 });
  s.addText("Suman 16.900 – 30.400 UF: casi tanto como el presupuesto original.", { x: 7.17, y: 2.78, w: 5.3, h: 0.6, fontFace: SANS, fontSize: 11.5, color: MUT, margin: 0 });

  tbl(s, [
    [hdrL("Partida omitida"), hdr("UF"), hdrL("Por qué es obligatoria")],
    [L("Aguas lluvias"), "2.203 – 4.407", L("El terreno va de la cota 149 a la 163 y tiene canales y un tranque")],
    [L("Áreas verdes ejecutadas"), "4.064 – 6.757", L("13.798 m² con riego, especies y mobiliario")],
    [L("Proyectos, especialidades, ITO y permisos"), "3.672 – 6.365", L("Entre 6% y 10% del costo de obra")],
    [L("Cierre perimetral"), "2.326 – 3.599", L("~2.100 ml; un condominio con control de acceso lo necesita")],
    [L("Empalmes y aportes reembolsables"), "2.203 – 4.407", L("90 arranques de agua y alcantarillado")],
    [L("Canales y servidumbres"), "1.469 – 2.938", L("Cinco tramos, dos entubados, según L_03")],
    [L("Movimiento de tierras y rasante"), "979 – 1.959", L("Preparación previa a cualquier pavimento")]
  ], { x: 0.6, y: 3.68, w: 12.1, colW: [4.1, 2.0, 6.0], rowH: 0.37, fontSize: 11.5, fill: { color: CARD } });

  s.addText([
    { text: "Total reconciliado con imprevistos:  ", options: { color: MUT } },
    { text: "38.241 – 68.915 UF", options: { bold: true, color: GREEN } },
    { text: "   ·   425 – 766 UF por sitio   ·   0,30 – 0,54 UF por m² vendible", options: { color: MUT } }
  ], { x: 0.62, y: 6.6, w: 12.05, h: 0.4, fontFace: SANS, fontSize: 14, margin: 0 });
}

// ══════════════════ 6 · ESCENARIOS ══════════════════
{
  const s = lightSlide("El loteo en tres escenarios", "03 · Resultados de la Etapa 1");
  s.addChart(p.ChartType.bar, [
    { name: "TIR del proyecto", labels: ["Conservador\n0,8 sitios/mes", "Base\n1,2 sitios/mes", "Optimista\n1,8 sitios/mes"], values: [0.169, 0.427, 1.123] }
  ], {
    x: 0.6, y: 1.62, w: 5.5, h: 3.0, barDir: "col", chartColors: [OCHRE, BLUE, GREEN], varyColors: true,
    showTitle: true, title: "TIR del proyecto", titleFontFace: SANS, titleFontSize: 13, titleColor: INK,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "0.0%", dataLabelFontSize: 12,
    dataLabelFontFace: SANS, dataLabelColor: INK, catAxisLabelColor: MUT, catAxisLabelFontSize: 10,
    valAxisLabelColor: MUT, valAxisLabelFormatCode: "0%", valGridLine: { color: "DCE0D8", size: 0.5 },
    catGridLine: { style: "none" }, showLegend: false, valAxisMaxVal: 1.3, plotArea: { fill: { color: CARD } }
  });
  s.addChart(p.ChartType.bar, [
    { name: "Utilidad neta", labels: ["Conservador", "Base", "Optimista"], values: [137625, 196307, 219423] }
  ], {
    x: 6.5, y: 1.62, w: 6.2, h: 3.0, barDir: "col", chartColors: [OCHRE, BLUE, GREEN], varyColors: true,
    showTitle: true, title: "Utilidad neta del loteo (UF)", titleFontFace: SANS, titleFontSize: 13, titleColor: INK,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "#,##0", dataLabelFontSize: 12,
    dataLabelFontFace: SANS, dataLabelColor: INK, catAxisLabelColor: MUT, catAxisLabelFontSize: 10,
    valAxisLabelColor: MUT, valAxisLabelFormatCode: "#,##0", valGridLine: { color: "DCE0D8", size: 0.5 },
    catGridLine: { style: "none" }, showLegend: false, plotArea: { fill: { color: CARD } }
  });
  tbl(s, [
    [hdrL(""), hdr("Conservador"), hdr("Base"), hdr("Optimista")],
    [L("Ingresos totales"), "457.476", "496.546", "505.071"],
    [L("Costos totales con terreno"), "268.949", "227.633", "204.491"],
    [L("Margen neto"), "30,1%", "39,5%", "43,4%"],
    [L("VAN al 12%"), "+18.584", "+80.537", "+135.726"],
    [L("Capital máximo expuesto"), "80.500", "67.000", "52.250"],
    [L("Último año de venta"), "Año 11", "Año 7", "Año 5"]
  ], { x: 0.6, y: 4.82, w: 12.1, colW: [4.3, 2.6, 2.6, 2.6], rowH: 0.32, fontSize: 11.5, fill: { color: CARD } });
}

// ══════════════════ 7 · FLUJO DE CAJA ══════════════════
{
  const s = lightSlide("Flujo de caja del escenario base", "04 · Caja");
  const years = ["Año 0", "Año 1", "Año 2", "Año 3", "Año 4", "Año 5", "Año 6", "Año 7", "Año 8"];
  s.addChart([
    { type: p.ChartType.bar, data: [{ name: "Flujo del período", labels: years, values: [-32000, -35000, 49585, 17878, 48250, 25642, 48955, 65474, -20054] }],
      options: { chartColors: [BLUE], barGapWidthPct: 45 } },
    { type: p.ChartType.line, data: [{ name: "Flujo acumulado", labels: years, values: [-32000, -67000, -17415, 463, 48712, 74355, 123310, 188784, 168730] }],
      options: { chartColors: [OCHRE], lineSize: 3, lineSmooth: false } }
  ], {
    x: 0.6, y: 1.6, w: 12.1, h: 3.6,
    catAxisLabelColor: MUT, catAxisLabelFontSize: 11, catAxisLabelFontFace: SANS,
    valAxisLabelColor: MUT, valAxisLabelFormatCode: "#,##0", valGridLine: { color: "DCE0D8", size: 0.5 },
    catGridLine: { style: "none" }, showLegend: true, legendPos: "t", legendColor: MUT, legendFontSize: 11,
    plotArea: { fill: { color: CARD } }
  });
  const notes = [
    ["Peak de caja negativa", "67.000 UF", "en el año 1, antes de vender el primer sitio"],
    ["Recuperación", "Año 3", "el flujo acumulado vuelve a cero"],
    ["Terreno pagado", "Año 6", "5 años desde el permiso, sin saldo final"]
  ];
  notes.forEach(([k, v, sub], i) => {
    const x = 0.6 + i * 4.1;
    card(s, x, 5.45, 3.9, 1.5);
    s.addText(k.toUpperCase(), { x: x + 0.24, y: 5.63, w: 3.4, h: 0.26, fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 1.2, color: BLUE, margin: 0 });
    s.addText(v, { x: x + 0.24, y: 5.9, w: 3.4, h: 0.45, fontFace: SANS, fontSize: 20, bold: true, color: INK, margin: 0 });
    s.addText(sub, { x: x + 0.24, y: 6.36, w: 3.5, h: 0.5, fontFace: SANS, fontSize: 11, color: MUT, margin: 0 });
  });
}

// ══════════════════ 8 · SENSIBILIDAD ══════════════════
{
  const s = lightSlide("Dónde se rompe el negocio", "05 · Sensibilidad");
  s.addText("TIR según velocidad de venta y costo de urbanización. Todo lo demás en supuestos base.", {
    x: 0.62, y: 1.5, w: 12.05, h: 0.35, fontFace: SANS, fontSize: 13.5, color: MUT, margin: 0
  });
  const g = (v) => ({ text: v, options: { fill: { color: parseFloat(v) >= 40 ? "D8E6D6" : parseFloat(v) >= 30 ? "E6EDE2" : parseFloat(v) >= 25 ? "F0EFE3" : "F6E9DC" }, bold: true } });
  tbl(s, [
    [hdrL("Sitios vendidos por año"), hdr("Urbanización 45.000 UF"), hdr("Urbanización 60.000 UF"), hdr("Urbanización 80.000 UF")],
    [L("8  ·  0,7 al mes"), g("28,5%"), g("24,5%"), g("20,0%")],
    [L("10  ·  escenario conservador"), g("35,3%"), g("30,9%"), g("26,2%")],
    [L("12  ·  1 al mes"), g("42,2%"), g("37,2%"), g("31,3%")],
    [L("15  ·  escenario base"), g("48,3%"), g("42,7%"), g("39,7%")],
    [L("18  ·  1,5 al mes"), g("56,5%"), g("50,3%"), g("42,7%")],
    [L("21  ·  escenario optimista"), g("63,8%"), g("57,1%"), g("48,8%")],
    [L("24  ·  2 al mes"), g("70,6%"), g("63,4%"), g("54,6%")]
  ], { x: 0.6, y: 2.0, w: 12.1, colW: [4.3, 2.6, 2.6, 2.6], rowH: 0.36, fill: { color: CARD } });

  card(s, 0.6, 5.6, 12.1, 1.35, "E4EBE2");
  s.addText("Ya no hay línea de flotación dentro del rango realista", { x: 0.95, y: 5.78, w: 11.4, h: 0.35, fontFace: SANS, fontSize: 16, bold: true, color: GREEN, margin: 0 });
  s.addText("Antes el proyecto se hundía bajo 12 sitios al año. Ahora toda la matriz rinde sobre 20%: incluso a 0,7 sitios al mes con la urbanización en el techo del rango. La velocidad sigue valiendo 30 puntos de TIR entre el peor y el mejor caso, pero dejó de ser un riesgo de supervivencia y pasó a ser una palanca de rentabilidad.", {
    x: 0.95, y: 6.13, w: 11.45, h: 0.75, fontFace: SANS, fontSize: 12.5, color: MUT, lineSpacing: 17, margin: 0
  });
}

// ══════════════════ 9 · PRECIO Y EQUILIBRIO ══════════════════
{
  const s = lightSlide("El terreno está barato, no caro", "06 · Precio y punto de equilibrio");
  s.addChart(p.ChartType.bar, [
    { name: "UF", labels: ["Precio pedido", "Residual\nconservador", "Residual base"], values: [119000, 107939, 298140] }
  ], {
    x: 0.6, y: 1.6, w: 6.0, h: 3.3, barDir: "col", chartColors: [BLUE, OCHRE, GREEN], varyColors: true,
    showTitle: true, title: "Precio pedido frente al valor residual (TIR objetivo 18%)", titleFontFace: SANS, titleFontSize: 12.5, titleColor: INK,
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "#,##0", dataLabelFontSize: 12,
    dataLabelFontFace: SANS, dataLabelColor: INK, catAxisLabelColor: MUT, catAxisLabelFontSize: 10.5,
    valAxisLabelColor: MUT, valAxisLabelFormatCode: "#,##0", valGridLine: { color: "DCE0D8", size: 0.5 },
    catGridLine: { style: "none" }, showLegend: false, plotArea: { fill: { color: CARD } }
  });
  card(s, 6.95, 1.6, 5.75, 1.62);
  stat(s, 7.3, 1.75, 5.05, "25 sitios", "para cubrir el terreno completo", BLUE, "Cada sitio deja 4.749 UF netos. El saldo de 99.000 UF se cubre con 21.");
  card(s, 6.95, 3.28, 5.75, 1.62, "E4EBE2");
  stat(s, 7.3, 3.43, 5.05, "44 sitios", "para no perder plata", GREEN, "La mitad del inventario. Antes de la corrección eran 64, el 71%.");

  card(s, 0.6, 5.2, 12.1, 1.62);
  s.addText("Qué cambia esto estratégicamente", { x: 0.95, y: 5.4, w: 11.4, h: 0.33, fontFace: SANS, fontSize: 15.5, bold: true, color: INK, margin: 0 });
  s.addText("Que el equilibrio esté en la mitad del inventario le da al proyecto algo que antes no tenía: margen para bajar precio y acelerar. Si a mitad de camino conviene liquidar los últimos 30 sitios a 3,2 UF/m² para cerrar el ciclo y liberar capital hacia la etapa comercial, el negocio lo resiste sin problemas. Esa opcionalidad vale más que los dos o tres puntos de margen que se sacrifican.", {
    x: 0.95, y: 5.77, w: 11.45, h: 0.95, fontFace: SANS, fontSize: 12.5, color: MUT, lineSpacing: 17, margin: 0
  });
}

// ══════════════════ 10 · PLAZO ══════════════════
{
  const s = lightSlide("Los 5 años corren desde el permiso", "07 · Plazo de pago del terreno");
  s.addText("Con un año para tramitar el permiso, el vencimiento real cae en el año 6 del proyecto. Eso vale, en la práctica, un año completo de ventas.", {
    x: 0.62, y: 1.5, w: 12.05, h: 0.35, fontFace: SANS, fontSize: 13.5, color: MUT, margin: 0
  });
  tbl(s, [
    [hdrL("Ritmo de venta"), hdr("Vendidos al vencer (año 6)"), hdr("Ingresos acumulados"), hdr("% de cada venta necesario"), hdr("Saldo al vencer")],
    [L("0,8 al mes  ·  10 al año"), "50", "271.360", "40%", { text: "14.024", options: { color: OCHRE, bold: true } }],
    [L("1,0 al mes  ·  12 al año"), "60", "325.632", "33%", { text: "0", options: { color: GREEN, bold: true } }],
    [L("1,2 al mes  ·  15 al año  (base)"), "75", "407.040", "27%", { text: "0", options: { color: GREEN, bold: true } }],
    [L("2,0 al mes  ·  24 al año"), "90", "477.366", "23%", { text: "0", options: { color: GREEN, bold: true } }]
  ], { x: 0.6, y: 2.05, w: 12.1, colW: [3.6, 2.3, 2.2, 2.3, 1.7], rowH: 0.4, fill: { color: CARD } });

  card(s, 0.6, 4.45, 5.9, 2.5, "E4EBE2");
  s.addText("EL PLAZO DEJÓ DE SER UN PROBLEMA", { x: 0.92, y: 4.65, w: 5.3, h: 0.28, fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 1.4, color: GREEN, margin: 0 });
  s.addText("Desde 1 sitio al mes el terreno queda pagado dentro del plazo destinando el 30–33% de cada escritura, sin saldo final. Sólo a 0,8 al mes aparecen 14.000 UF, cubribles con caja propia.\n\nEn la revisión anterior, con el plazo corriendo desde la escritura, ese saldo era de 43.000 UF y caía en el peor momento.", {
    x: 0.92, y: 4.98, w: 5.35, h: 1.85, fontFace: SANS, fontSize: 12.5, color: MUT, lineSpacing: 18, margin: 0
  });
  card(s, 6.85, 4.45, 5.85, 2.5);
  s.addText("LO QUE HAY QUE DEJAR ESCRITO", { x: 7.17, y: 4.65, w: 5.2, h: 0.28, fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 1.4, color: BLUE, margin: 0 });
  s.addText([
    { text: "«Cinco años contados desde la aprobación del permiso de loteo», con esa redacción exacta.", options: { bullet: true, breakLine: true } },
    { text: "Prórroga automática de 24 meses si la tramitación excede el año pactado.", options: { bullet: true, breakLine: true } },
    { text: "30% de cada escritura al terreno, ≈1.500 UF por sitio.", options: { bullet: true, breakLine: true } },
    { text: "Hipoteca con alzamientos parciales tarifados, plazo de 10 días hábiles y multa.", options: { bullet: true } }
  ], { x: 7.17, y: 4.98, w: 5.3, h: 1.85, fontFace: SANS, fontSize: 12, color: MUT, paraSpaceAfter: 8, valign: "top", margin: 0 });
}

// ══════════════════ 11 · CONDICIONES Y CAPITAL ══════════════════
{
  const s = lightSlide("Condiciones a exigir y capital a levantar", "08 · Negociación y estructura de capital");
  s.addText("QUÉ EXIGIR AL VENDEDOR", { x: 0.62, y: 1.5, w: 6, h: 0.28, fontFace: SANS, fontSize: 10, bold: true, charSpacing: 1.5, color: BLUE, margin: 0 });
  card(s, 0.6, 1.85, 6.0, 4.1);
  s.addText([
    { text: "Condición suspensiva de permiso y factibilidad, con devolución íntegra del pie si en 18 meses no están.", options: { bullet: true, breakLine: true } },
    { text: "Prórroga automática de 24 meses por demora de tramitación.", options: { bullet: true, breakLine: true } },
    { text: "Servidumbres de canal saneadas antes de la compraventa, o retención de precio por el costo de la obra.", options: { bullet: true, breakLine: true } },
    { text: "Expropiación de los 1.843,70 m² por cuenta del vendedor.", options: { bullet: true, breakLine: true } },
    { text: "Alzamientos parciales tarifados, con monto por sitio, plazo y multa.", options: { bullet: true, breakLine: true } },
    { text: "Prepago sin multa y sin aceleración por metas de venta.", options: { bullet: true, breakLine: true } },
    { text: "Derecho de primera oferta sobre paños colindantes del vendedor.", options: { bullet: true } }
  ], { x: 0.95, y: 2.05, w: 5.35, h: 3.75, fontFace: SANS, fontSize: 11.5, color: INK, paraSpaceAfter: 6, lineSpacing: 15, valign: "top", margin: 0 });

  s.addText("CUÁNTO CAPITAL SE NECESITA", { x: 6.87, y: 1.5, w: 6, h: 0.28, fontFace: SANS, fontSize: 10, bold: true, charSpacing: 1.5, color: BLUE, margin: 0 });
  const caps = [["Conservador", "80.500 UF", OCHRE], ["Base", "67.000 UF", BLUE], ["Optimista", "52.250 UF", GREEN]];
  caps.forEach(([k, v, c], i) => {
    const y = 1.85 + i * 0.95;
    card(s, 6.85, y, 5.85, 0.8);
    s.addText(k, { x: 7.17, y: y + 0.2, w: 2.6, h: 0.4, fontFace: SANS, fontSize: 14, bold: true, color: MUT, margin: 0 });
    s.addText(v, { x: 9.6, y: y + 0.16, w: 2.85, h: 0.45, fontFace: SANS, fontSize: 21, bold: true, color: c, align: "right", margin: 0 });
  });
  card(s, 6.85, 4.7, 5.85, 1.2, "E4EBE2");
  s.addText("Con pie de 10.000 UF, urbanización por macro-etapas de 23 sitios y promesas con 20% anticipado, el peak del escenario base baja a cerca de 45.000 UF.", {
    x: 7.17, y: 4.88, w: 5.3, h: 0.9, fontFace: SANS, fontSize: 12.5, color: MUT, lineSpacing: 17, margin: 0
  });
  card(s, 0.6, 6.05, 12.1, 0.9, INK);
  s.addText([
    { text: "Recomendación:  ", options: { bold: true, color: "FFFFFF" } },
    { text: "levantar 95.000 UF — 60.000 de capital propio o de socios y 35.000 como línea de urbanización con garantía sobre macrolotes no vendidos. Sobredimensionar aquí es barato; quedarse corto en el año 1, no.", options: { color: MUTL } }
  ], { x: 0.95, y: 6.22, w: 11.4, h: 0.6, fontFace: SANS, fontSize: 13, lineSpacing: 18, margin: 0 });
}

// ══════════════════ 12 · ETAPA 2 ══════════════════
{
  const s = lightSlide("El centro comercial es chico — y trae pádel", "09 · Etapa 2");
  s.addText("La lámina L_05 muestra el proyecto real: 729,7 m² construidos, de los cuales 619,2 son arrendables. Ocho locales de 38,4 m², dos restaurantes de 156 m², cuatro canchas de pádel y el control de acceso del loteo.", {
    x: 0.62, y: 1.5, w: 12.05, h: 0.6, fontFace: SANS, fontSize: 13.5, color: MUT, lineSpacing: 19, margin: 0
  });
  tbl(s, [
    [hdrL("Centro comercial y pádel"), hdr("Conservador"), hdr("Base"), hdr("Optimista")],
    [L("Renta bruta anual (UF)"), "2.078", "2.598", "3.117"],
    [L("NOI locales + pádel (UF)"), "2.054", "3.003", "3.956"],
    [L("Inversión con terreno asignado (UF)"), "33.082", "29.974", "28.069"],
    [L("Yield on cost"), "6,2%", "10,0%", "14,1%"],
    [L("Valor estabilizado (UF)"), "21.626", "35.331", "52.748"],
    [L("Creación de valor (UF)"), { text: "−11.456", options: { color: RED, bold: true } }, { text: "+5.357", options: { color: GREEN, bold: true } }, { text: "+24.679", options: { color: GREEN, bold: true } }]
  ], { x: 0.6, y: 2.25, w: 7.4, colW: [3.2, 1.4, 1.4, 1.4], rowH: 0.37, fontSize: 11.5, fill: { color: CARD } });

  card(s, 8.25, 2.25, 4.45, 1.75, "F6E9DC");
  s.addText("SU JUSTIFICACIÓN NO ES FINANCIERA", { x: 8.55, y: 2.42, w: 3.9, h: 0.28, fontFace: SANS, fontSize: 9, bold: true, charSpacing: 1.2, color: OCHRE, margin: 0 });
  s.addText("Crea apenas 5.357 UF en escenario base. Se construye porque es lo que permite vender el sitio 60 al mismo precio que el sitio 20, no porque sea buen activo por sí solo.", {
    x: 8.55, y: 2.72, w: 3.9, h: 1.15, fontFace: SANS, fontSize: 12, color: MUT, lineSpacing: 17, margin: 0
  });
  card(s, 8.25, 4.15, 4.45, 1.65, "E4EBE2");
  s.addText("EL PÁDEL MERECE ATENCIÓN PROPIA", { x: 8.55, y: 4.32, w: 3.9, h: 0.28, fontFace: SANS, fontSize: 9, bold: true, charSpacing: 1.2, color: GREEN, margin: 0 });
  s.addText("Cuatro canchas aportan 500–1.350 UF netas al año sobre 3.500 UF de inversión. Arrendarlas a un operador, no operarlas.", {
    x: 8.55, y: 4.62, w: 3.9, h: 1.05, fontFace: SANS, fontSize: 12, color: MUT, lineSpacing: 17, margin: 0
  });
  card(s, 8.25, 6.0, 4.45, 0.95, INK);
  s.addText([{ text: "619,2 m² arrendables", options: { bold: true, color: "FFFFFF", fontSize: 14, breakLine: true } },
             { text: "4 canchas de pádel · control de acceso", options: { color: MUTL, fontSize: 11 } }],
    { x: 8.55, y: 6.16, w: 3.95, h: 0.65, fontFace: SANS, lineSpacing: 17, valign: "top", margin: 0 });
  card(s, 0.6, 5.05, 7.4, 1.9, "F6E9DC");
  s.addText("Corrección de diseño que conviene hacer ahora", { x: 0.95, y: 5.25, w: 6.7, h: 0.33, fontFace: SANS, fontSize: 15, bold: true, color: INK, margin: 0 });
  s.addText("Los locales de 38,4 m² son chicos para casi todo operador de conveniencia relevante: un minimarket de cadena necesita 250–400 m². Fusionar cuatro locales en uno, aunque baje la renta por m², atrae un ancla real y sube la ocupación de todo el resto. Es un cambio de proyecto barato si se hace antes de construir.", {
    x: 0.95, y: 5.62, w: 6.75, h: 1.2, fontFace: SANS, fontSize: 12, color: MUT, lineSpacing: 17, margin: 0
  });
}

// ══════════════════ 13 · ETAPA 3 ══════════════════
{
  const s = lightSlide("Colegio o estación de servicio", "10 · Etapa 3 · Paño norte de 18.619 m²");
  card(s, 0.6, 1.6, 6.0, 3.5);
  s.addText("ALTERNATIVA A  ·  COLEGIO", { x: 0.95, y: 1.8, w: 5.3, h: 0.28, fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 1.4, color: OCHRE, margin: 0 });
  s.addText("Destruye valor en dos de tres escenarios", { x: 0.95, y: 2.1, w: 5.35, h: 0.7, fontFace: SER, fontSize: 20, bold: true, color: INK, margin: 0 });
  s.addText("177.894 UF de inversión —casi tanto como toda la utilidad neta del loteo— para un activo monofuncional que rinde 6,9% y se recupera en 14,5 años. Si el sostenedor falla, no hay uso alternativo.\n\nLa vía razonable es vender el paño sin construir: 45.885 UF a 2,5 UF/m², cuatro veces el costo asignado del terreno, con cero riesgo y cero capital.", {
    x: 0.95, y: 2.85, w: 5.35, h: 2.05, fontFace: SANS, fontSize: 12.5, color: MUT, lineSpacing: 18, margin: 0
  });
  s.addShape(p.ShapeType.roundRect, { x: 6.85, y: 1.6, w: 5.85, h: 3.5, rectRadius: 0.06, fill: { color: "E4EBE2" }, shadow: sh(), line: { color: GREEN, width: 1.5 } });
  s.addText("ALTERNATIVA B  ·  ESTACIÓN DE SERVICIO", { x: 7.17, y: 1.8, w: 5.3, h: 0.28, fontFace: SANS, fontSize: 9.5, bold: true, charSpacing: 1.4, color: GREEN, margin: 0 });
  s.addText("El mejor retorno de todo el masterplan", { x: 7.17, y: 2.1, w: 5.3, h: 0.7, fontFace: SER, fontSize: 20, bold: true, color: INK, margin: 0 });
  s.addText("2.200 m² con frente a Avenida San Miguel arrendados a un operador de marca que construye por su cuenta. Inversión propia: 4.879 UF en accesos, EISTU y empalmes. Canon de 350 UF al mes.", {
    x: 7.17, y: 2.85, w: 5.3, h: 1.0, fontFace: SANS, fontSize: 12.5, color: MUT, lineSpacing: 18, margin: 0
  });
  [["86%", "yield on cost"], ["1,2 años", "payback"], ["56.000 UF", "valor del activo"]].forEach(([v, l], i) => {
    const x = 7.17 + i * 1.78;
    s.addText(v, { x, y: 3.95, w: 1.7, h: 0.42, fontFace: SANS, fontSize: 17, bold: true, color: GREEN, margin: 0 });
    s.addText(l.toUpperCase(), { x, y: 4.38, w: 1.72, h: 0.5, fontFace: SANS, fontSize: 8.5, bold: true, charSpacing: 0.9, color: MUT, margin: 0 });
  });
  card(s, 0.6, 5.3, 12.1, 1.65, INK);
  s.addText("Recomendación: estación de servicio primero; el colegio, sólo como venta del paño", {
    x: 0.95, y: 5.5, w: 11.4, h: 0.35, fontFace: SANS, fontSize: 15.5, bold: true, color: "FFFFFF", margin: 0
  });
  s.addText("Se subdivide el paño norte en 2.200–2.500 m² para la estación y un remanente de 16.154 m². La estación se licita entre operadores de marca bajo arriendo de suelo a 20–25 años, y su tienda de conveniencia pasa a ser el ancla que a los locales de 38 m² les falta. Requisito duro: ningún operador de marca firma sin 8.000–12.000 vehículos diarios — hay que pedir el TMDA de Avenida San Miguel a Vialidad del Maule.", {
    x: 0.95, y: 5.88, w: 11.45, h: 0.95, fontFace: SANS, fontSize: 12, color: MUTL, lineSpacing: 17, margin: 0
  });
}

// ══════════════════ 14 · SECUENCIA ══════════════════
{
  const s = lightSlide("El masterplan por etapas", "11 · Secuencia");
  const steps = [
    ["AÑO 0", "Promesa y permisos", "Pie contra promesa con condición suspensiva. Proyecto, especialidades, factibilidades, EISTU. Cotización cerrada de urbanización.", "Permiso aprobado y factibilidad sanitaria emitida"],
    ["AÑO 1", "Urbanización 1 y preventa", "Matrices troncales, acceso, Calle 1 y las primeras 23 parcelas. Sala de ventas. Licitación del paño de la estación.", "12 promesas firmadas antes de la macro-etapa 2"],
    ["AÑO 2", "Escrituras y estación", "Escrituración con garantía de obras. Firma del arriendo de suelo de la estación: la primera renta permanente del proyecto.", "Ritmo ≥1 sitio al mes en dos semestres"],
    ["AÑO 3", "Centro comercial y pádel", "Se construye con 30–40 sitios vendidos y la estación operando. 30.000 UF financiables con caja propia.", "Tres cartas de intención de arriendo firmadas"],
    ["AÑO 6", "Vence el plazo del terreno", "Desde 1 sitio al mes el saldo ya está extinguido. Revisar la proyección en el año 4, no en el 6.", "Saldo del terreno en cero"]
  ];
  steps.forEach(([yr, t, d, gate], i) => {
    const y = 1.58 + i * 1.14;
    s.addShape(p.ShapeType.ellipse, { x: 0.62, y: y + 0.14, w: 0.72, h: 0.72, fill: { color: i === 4 ? GREEN : BLUE } });
    s.addText(yr.replace("AÑO ", ""), { x: 0.62, y: y + 0.3, w: 0.72, h: 0.4, fontFace: SANS, fontSize: 16, bold: true, color: "FFFFFF", align: "center", margin: 0 });
    s.addText(t, { x: 1.55, y: y + 0.08, w: 3.5, h: 0.35, fontFace: SANS, fontSize: 15, bold: true, color: INK, margin: 0 });
    s.addText(d, { x: 1.55, y: y + 0.44, w: 6.6, h: 0.6, fontFace: SANS, fontSize: 11.5, color: MUT, lineSpacing: 15, margin: 0 });
    s.addShape(p.ShapeType.roundRect, { x: 8.5, y: y + 0.08, w: 4.2, h: 0.86, rectRadius: 0.05, fill: { color: "E8ECE4" }, line: { color: "D5DBD0", width: 0.5 } });
    s.addText("PUERTA", { x: 8.75, y: y + 0.16, w: 3.8, h: 0.22, fontFace: SANS, fontSize: 8.5, bold: true, charSpacing: 1.3, color: BLUE, margin: 0 });
    s.addText(gate, { x: 8.75, y: y + 0.38, w: 3.75, h: 0.5, fontFace: SANS, fontSize: 11, color: MUT, lineSpacing: 14, margin: 0 });
  });
}

// ══════════════════ 15 · RIESGOS Y DATA ROOM ══════════════════
{
  const s = lightSlide("Riesgos y lo que falta antes de firmar", "12 · Riesgos y data room");
  s.addText("LOS CUATRO RIESGOS QUE IMPORTAN", { x: 0.62, y: 1.5, w: 6, h: 0.28, fontFace: SANS, fontSize: 10, bold: true, charSpacing: 1.5, color: BLUE, margin: 0 });
  const risks = [
    ["Urbanización muy sobre 80.000 UF", "Alto", "El riesgo dominante. Tres cotizaciones cerradas con IVA antes de la compraventa."],
    ["Sin factibilidad sanitaria", "Crítico", "Una planta elevadora o PTAS propia suma 20.000–40.000 UF y carga permanente."],
    ["Servidumbres de canal sin sanear", "Medio", "Cinco tramos pueden bloquear la recepción de la urbanización."],
    ["Locales de 38 m² sin arrendatarios", "Bajo", "Fusionar locales para un ancla antes de construir."]
  ];
  risks.forEach(([r, imp, m], i) => {
    const y = 1.88 + i * 1.22;
    card(s, 0.6, y, 6.0, 1.1);
    s.addText(r, { x: 0.92, y: y + 0.12, w: 4.3, h: 0.32, fontFace: SANS, fontSize: 13, bold: true, color: INK, margin: 0 });
    s.addText(imp.toUpperCase(), { x: 5.2, y: y + 0.14, w: 1.15, h: 0.28, fontFace: SANS, fontSize: 9, bold: true, charSpacing: 1, align: "right",
      color: imp === "Crítico" ? RED : imp === "Alto" ? OCHRE : MUT, margin: 0 });
    s.addText(m, { x: 0.92, y: y + 0.46, w: 5.4, h: 0.55, fontFace: SANS, fontSize: 11, color: MUT, lineSpacing: 15, margin: 0 });
  });
  s.addText("DATA ROOM — LOS TRES PRIMEROS SON BLOQUEANTES", { x: 6.87, y: 1.5, w: 6, h: 0.28, fontFace: SANS, fontSize: 10, bold: true, charSpacing: 1.5, color: BLUE, margin: 0 });
  card(s, 6.85, 1.88, 5.85, 5.05);
  s.addText([
    { text: "Tres presupuestos cerrados de urbanización, con IVA, por partida y por macro-etapa.", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Certificados de factibilidad de agua potable y alcantarillado para los 90 sitios.", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Estudio de títulos de ambos roles: servidumbres, tranque, derechos de agua, expropiación.", options: { bullet: true, breakLine: true, bold: true } },
    { text: "Certificado de informaciones previas vigente y confirmación de la zona U-17.", options: { bullet: true, breakLine: true } },
    { text: "Estudio de absorción real en el sector oriente de Talca, a precio de escritura.", options: { bullet: true, breakLine: true } },
    { text: "TMDA de Avenida San Miguel en la Dirección de Vialidad del Maule.", options: { bullet: true, breakLine: true } },
    { text: "Sondeo con operadores de estación de servicio, conveniencia y pádel.", options: { bullet: true, breakLine: true } },
    { text: "Avalúo fiscal y sobretasa de sitios eriazos sobre el inventario no vendido.", options: { bullet: true } }
  ], { x: 7.17, y: 2.08, w: 5.3, h: 4.7, fontFace: SANS, fontSize: 11.5, color: INK, paraSpaceAfter: 8, lineSpacing: 15, valign: "top", margin: 0 });
}

// ══════════════════ 16 · RECOMENDACIÓN ══════════════════
{
  const s = darkSlide();
  s.addText("RECOMENDACIÓN FINAL", { x: 0.8, y: 0.6, w: 8, h: 0.3, fontFace: SANS, fontSize: 11, bold: true, charSpacing: 2.4, color: BLUEL, margin: 0 });
  s.addText("Comprar, cotizar la urbanización en firme,\ny ejecutar rápido.", {
    x: 0.78, y: 1.0, w: 11.8, h: 1.35, fontFace: SER, fontSize: 33, bold: true, color: "FFFFFF", lineSpacing: 42, margin: 0
  });
  const answers = [
    ["Precio máximo", "298.000 UF", "a TIR objetivo de 18% en escenario base; 108.000 UF incluso asumiendo el conservador completo"],
    ["Capital a levantar", "95.000 UF", "67.000 de peak en base, 80.500 en conservador, más colchón"],
    ["Estructura del saldo", "30% por escritura", "≈1.500 UF por sitio, con hipoteca de alzamiento parcial y prepago libre"],
    ["Rentabilidad completa", "42,7% de TIR", "utilidad neta de 196.307 UF en la Etapa 1, más los activos de renta"],
    ["Etapa que más valor crea", "El loteo", "196.000 UF en monto; la estación de servicio en retorno sobre capital"],
    ["Activo ancla", "Estación de servicio", "4.879 UF contra 177.894 del colegio, y payback de 1,2 contra 14,5 años"]
  ];
  answers.forEach(([k, v, sub], i) => {
    const x = 0.8 + (i % 3) * 4.05, y = 2.75 + Math.floor(i / 3) * 1.95;
    s.addShape(p.ShapeType.roundRect, { x, y, w: 3.8, h: 1.72, rectRadius: 0.06, fill: { color: INK2 }, line: { color: "2E4657", width: 0.75 } });
    s.addText(k.toUpperCase(), { x: x + 0.24, y: y + 0.16, w: 3.3, h: 0.26, fontFace: SANS, fontSize: 8.5, bold: true, charSpacing: 1.2, color: BLUEL, margin: 0 });
    s.addText(v, { x: x + 0.24, y: y + 0.44, w: 3.35, h: 0.42, fontFace: SANS, fontSize: 18, bold: true, color: "FFFFFF", margin: 0 });
    s.addText(sub, { x: x + 0.24, y: y + 0.88, w: 3.35, h: 0.75, fontFace: SANS, fontSize: 10.5, color: MUTL, lineSpacing: 14, margin: 0 });
  });
  s.addText("Modelación propia sobre los supuestos declarados. No constituye tasación, asesoría tributaria ni opinión legal. Valor de la UF: $40.846 al 10 de agosto de 2026.", {
    x: 0.8, y: 6.85, w: 11.7, h: 0.3, fontFace: SANS, fontSize: 9.5, color: MUT, margin: 0
  });
}

p.writeFile({ fileName: "/tmp/claude-0/-home-user-ali/7087cd42-a8be-5db7-86f2-2c10857f429c/scratchpad/Loteo_Talca_Presentacion.pptx" })
  .then(f => console.log("escrito:", f));
