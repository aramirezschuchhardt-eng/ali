# -*- coding: utf-8 -*-
"""Sensibilidades Etapa 1 + modelos Etapa 2 (strip center) y Etapa 3 (colegio / EDS)."""
import sys, copy
sys.path.insert(0, '/tmp/claude-0/-home-user-ali/7087cd42-a8be-5db7-86f2-2c10857f429c/scratchpad')
from modelo import ESC, correr, npv, irr, SUP_COMERCIAL, SUP_COLEGIO, TERRENO_COM, TERRENO_COLE

print("=" * 100)
print("SENSIBILIDAD 1: velocidad de venta x costo de urbanización (precio base 3,5->4,0 UF/m2)")
print(f"{'lotes/año':>10} | " + " | ".join(f"urb {u/1000:.0f}k UF" for u in (130_000, 150_000, 185_000)))
for ritmo in (8, 10, 12, 15, 18, 21, 24, 30):
    fila = []
    for u in (130_000, 150_000, 185_000):
        p = copy.deepcopy(ESC["Base"]); p["ritmo"] = ritmo; p["urb"] = u; p["horizonte"] = 16
        r = correr("s", p)
        t = r["tir"]
        fila.append(f"TIR {t*100:5.1f}%  VAN {r['van12']:>8,.0f}" if t else "     s/TIR         ")
    print(f"{ritmo:>10} | " + " | ".join(fila))

print()
print("=" * 100)
print("SENSIBILIDAD 2: ¿cuándo llega el precio a 4,0 UF/m2? (ritmo 18/año, urb 150k)")
for etiqueta, precios in [
    ("nunca (3,5 plano)",      [3.5] * 9),
    ("desde año 2 de venta",   [3.5, 4.0, 4.0, 4.1, 4.2, 4.2, 4.2, 4.2, 4.2]),
    ("desde año 3 de venta",   [3.5, 3.5, 4.0, 4.0, 4.1, 4.2, 4.2, 4.2, 4.2]),
    ("desde año 4 de venta",   [3.5, 3.5, 3.5, 4.0, 4.0, 4.1, 4.2, 4.2, 4.2]),
    ("precio cae a 3,2",       [3.2] * 9),
]:
    p = copy.deepcopy(ESC["Base"]); p["precio"] = precios
    r = correr("s", p)
    print(f"  {etiqueta:<24} ingresos {r['ingresos_tot']:>9,.0f} UF | margen neto {r['margen_neto']:5.1%} | "
          f"TIR {r['tir']*100 if r['tir'] else 0:5.1f}% | VAN12 {r['van12']:>9,.0f} | capital máx {r['capital_max']:>8,.0f}")

print()
print("=" * 100)
print("SENSIBILIDAD 3: % del flujo de ventas destinado a pagar el terreno (Base)")
for pct in (0.15, 0.20, 0.25, 0.30, 0.40):
    r = correr("s", ESC["Base"], pct_flujo_terreno=pct)
    print(f"  {pct:.0%} de cada venta -> capital máximo expuesto {r['capital_max']:>9,.0f} UF | "
          f"TIR {r['tir']*100:5.1f}% | terreno pagado al año {max(t for t,v in enumerate(r['pago_terreno']) if v>0)}")

print()
print("=" * 100)
print("SENSIBILIDAD 4: tamaño del pie")
for pie in (10_000, 15_000, 20_000, 30_000):
    r = correr("s", ESC["Base"], pie=pie)
    print(f"  pie {pie:>7,.0f} UF -> capital máximo expuesto {r['capital_max']:>9,.0f} UF | TIR {r['tir']*100:5.1f}%")

# ---------------------------------------------------------------- ETAPA 2
print()
print("=" * 100)
print("ETAPA 2 — STRIP CENTER (terreno 4.386 m2)")
GLA = {"Conservador": 1_150, "Base": 1_400, "Optimista": 1_600}
RENTA = {"Conservador": 0.28, "Base": 0.35, "Optimista": 0.42}   # UF/m2/mes
VAC = {"Conservador": 0.15, "Base": 0.08, "Optimista": 0.05}
COSTO_M2 = {"Conservador": 27, "Base": 24, "Optimista": 22}      # UF/m2 construido, shell&core
CAP = {"Conservador": 0.095, "Base": 0.085, "Optimista": 0.075}
for e in ("Conservador", "Base", "Optimista"):
    gla = GLA[e]
    obra = gla * COSTO_M2[e]
    exterior = 6_000          # estacionamientos, paisajismo, empalmes
    blandos = obra * 0.10     # proyectos, permisos, gerencia
    inv = obra + exterior + blandos + TERRENO_COM
    bruto = gla * RENTA[e] * 12
    efec = bruto * (1 - VAC[e])
    noi = efec * (1 - 0.12)   # gastos no recuperables, contribuciones, administración
    valor = noi / CAP[e]
    print(f"  {e:<12} GLA {gla:>5,} m2 | inversión {inv:>8,.0f} UF | NOI {noi:>7,.0f} UF/año | "
          f"yield on cost {noi/inv:5.1%} | valor @cap {CAP[e]:.1%} = {valor:>8,.0f} UF | "
          f"creación de valor {valor-inv:>8,.0f} UF ({(valor-inv)/inv:5.1%})")

# ---------------------------------------------------------------- ETAPA 3A
print()
print("=" * 100)
print("ETAPA 3A — COLEGIO (terreno 18.619 m2, 1.000 alumnos)")
for e, m2, costo_m2, renta_m2, cap in [
        ("Conservador", 7_000, 32, 0.22, 0.095),
        ("Base",        7_500, 29, 0.26, 0.085),
        ("Optimista",   8_000, 27, 0.30, 0.075)]:
    obra = m2 * costo_m2
    inv = obra * 1.12 + TERRENO_COLE          # +12% blandos
    noi = m2 * renta_m2 * 12 * 0.95           # build-to-suit, arriendo triple neto, 5% vacancia/riesgo
    valor = noi / cap
    print(f"  {e:<12} {m2:,} m2 const. | inversión {inv:>9,.0f} UF | renta {noi:>7,.0f} UF/año | "
          f"yield on cost {noi/inv:5.1%} | valor @cap {cap:.1%} = {valor:>9,.0f} UF | "
          f"creación {valor-inv:>8,.0f} UF | payback {inv/noi:4.1f} años")
print("  Alternativa: VENTA DEL PAÑO a sostenedor/inversionista (sin construir)")
for pr in (1.5, 2.5, 3.5):
    print(f"     terreno colegio a {pr} UF/m2 -> {SUP_COLEGIO*pr:>9,.0f} UF "
          f"(costo asignado {TERRENO_COLE:,.0f} UF, múltiplo {SUP_COLEGIO*pr/TERRENO_COLE:4.1f}x)")

# ---------------------------------------------------------------- ETAPA 3B
print()
print("=" * 100)
print("ETAPA 3B — ESTACIÓN DE SERVICIO (arriendo de terreno a operador de marca)")
SUP_EDS = 2_200
costo_terr_eds = TERRENO_COLE * SUP_EDS / SUP_COLEGIO
for e, canon, cap in [("Conservador", 220, 0.085), ("Base", 350, 0.075), ("Optimista", 500, 0.070)]:
    anual = canon * 12
    habilit = 3_500     # accesos, EISTU, urbanización del frente, empalmes
    inv = costo_terr_eds + habilit
    valor = anual / cap
    print(f"  {e:<12} canon {canon:>4} UF/mes = {anual:>6,.0f} UF/año | inversión propia {inv:>7,.0f} UF | "
          f"yield on cost {anual/inv:6.1%} | valor @cap {cap:.1%} = {valor:>8,.0f} UF | "
          f"payback {inv/anual:4.1f} años")
print(f"  (terreno EDS {SUP_EDS:,} m2, costo asignado {costo_terr_eds:,.0f} UF = "
      f"{costo_terr_eds/SUP_EDS:.2f} UF/m2)")

# ---------------------------------------------------------------- VALOR TOTAL
print()
print("=" * 100)
print("VALOR TOTAL DEL PAÑO POR ETAPAS (escenario Base, UF)")
r = correr("b", ESC["Base"])
sc_valor = (1_400 * 0.35 * 12 * 0.92 * 0.88) / 0.085
eds_valor = 350 * 12 / 0.075
sc_inv = 1_400 * 24 * 1.10 + 6_000 + TERRENO_COM
print(f"  Etapa 1 loteo — utilidad neta acumulada         {r['util_neta']:>10,.0f}")
print(f"  Etapa 2 strip center — valor estabilizado       {sc_valor:>10,.0f}  (inversión {sc_inv:,.0f})")
print(f"  Etapa 3 EDS en arriendo — valor capitalizado    {eds_valor:>10,.0f}  (inversión ~4.900)")
print(f"  Terreno remanente colegio (16.400 m2 @2,5)      {16_400*2.5:>10,.0f}")
