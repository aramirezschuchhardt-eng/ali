# -*- coding: utf-8 -*-
"""Modelo financiero Loteo Av. San Miguel 6850, Talca (19,26 ha)."""
import json

# ---------------- DATOS DUROS (de planos L_02 / L_03) ----------------
PANO_M2        = 192_627
N_LOTES        = 90
SUP_LOTES      = 127_866          # suma cuadro de superficies
SUP_LOTE_PROM  = SUP_LOTES / N_LOTES
SUP_COLEGIO    = 18_619
SUP_COMERCIAL  = 4_386
SUP_AAVV       = 13_798           # 11.649 + 2.149
SUP_VIAL       = PANO_M2 - SUP_LOTES - SUP_COLEGIO - SUP_COMERCIAL - SUP_AAVV
EXPROPIACION   = 1_844

TERRENO_TOTAL  = 119_000.0
PIE            = 20_000.0
SALDO          = TERRENO_TOTAL - PIE

# asignación de costo de terreno por uso (vialidad y AAVV cargan al loteo)
share_loteo    = (SUP_LOTES + SUP_AAVV + SUP_VIAL) / PANO_M2
share_colegio  = SUP_COLEGIO / PANO_M2
share_comercial= SUP_COMERCIAL / PANO_M2
TERRENO_LOTEO  = TERRENO_TOTAL * share_loteo
TERRENO_COLE   = TERRENO_TOTAL * share_colegio
TERRENO_COM    = TERRENO_TOTAL * share_comercial

def irr(flows):
    def f(r):
        return sum(c / (1 + r) ** i for i, c in enumerate(flows))
    lo = None
    r = -0.30
    while r < 3.0:
        if f(r) * f(r + 0.01) <= 0:
            lo, hi = r, r + 0.01
            break
        r += 0.01
    if lo is None:
        return None
    for _ in range(200):
        mid = (lo + hi) / 2
        if f(lo) * f(mid) <= 0:
            hi = mid
        else:
            lo = mid
    return (lo + hi) / 2

def npv(flows, r=0.12):
    return sum(f / (1 + r) ** i for i, f in enumerate(flows))

# ---------------- ESCENARIOS ----------------
ESC = {
    "Conservador": dict(
        inicio_venta=3, ritmo=10, precio=[3.3, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.8, 3.8, 3.8, 3.8],
        urb=185_000, gasto_com=0.055, admin=3_000, horizonte=14,
    ),
    "Base": dict(
        inicio_venta=2, ritmo=15, precio=[3.5, 3.5, 4.0, 4.0, 4.1, 4.2, 4.2, 4.2, 4.2],
        urb=155_000, gasto_com=0.045, admin=2_500, horizonte=11,
    ),
    "Optimista": dict(
        inicio_venta=1, ritmo=21, precio=[3.5, 4.0, 4.0, 4.2, 4.3, 4.4, 4.4, 4.4, 4.4],
        urb=135_000, gasto_com=0.040, admin=2_500, horizonte=9,
    ),
}

def correr(nombre, p, precio_terreno=TERRENO_TOTAL, pie=PIE, pct_flujo_terreno=0.25):
    terreno_costo = precio_terreno * share_loteo
    saldo = precio_terreno - pie
    H = p["horizonte"]
    T = range(H + 1)
    ventas_u   = [0.0] * (H + 1)
    ingresos   = [0.0] * (H + 1)
    restantes  = N_LOTES
    k = 0
    for t in T:
        if t < p["inicio_venta"] or restantes <= 0:
            continue
        u = min(p["ritmo"], restantes)
        pr = p["precio"][min(k, len(p["precio"]) - 1)]
        ventas_u[t] = u
        ingresos[t] = u * SUP_LOTE_PROM * pr
        restantes -= u
        k += 1
    ultimo_ano_venta = max(t for t in T if ventas_u[t] > 0)

    # urbanización en 3 etapas de 30 lotes: 45% / 30% / 25%
    urb = [0.0] * (H + 1)
    urb[p["inicio_venta"] - 1] += p["urb"] * 0.45
    urb[min(p["inicio_venta"] + 1, H)] += p["urb"] * 0.30
    urb[min(p["inicio_venta"] + 3, H)] += p["urb"] * 0.25

    # proyectos, permisos, especialidades (año 0 y 1)
    proyectos = [0.0] * (H + 1)
    proyectos[0] = 9_000
    proyectos[1] = 5_000

    gastos_com = [i * p["gasto_com"] for i in ingresos]
    admin = [p["admin"] if t <= ultimo_ano_venta + 1 else 0.0 for t in T]
    contrib = [500.0 if t <= ultimo_ano_venta else 0.0 for t in T]

    # pago del terreno: pie año 0 + % de cada venta hasta enterar saldo
    pago_terreno = [0.0] * (H + 1)
    pago_terreno[0] = pie
    pend = saldo
    for t in T:
        if pend <= 0 or ingresos[t] == 0:
            continue
        cuota = min(pend, ingresos[t] * pct_flujo_terreno)
        pago_terreno[t] += cuota
        pend -= cuota
    if pend > 0:  # saldo forzado al último año de venta
        pago_terreno[ultimo_ano_venta] += pend
        pend = 0

    egresos_op = [urb[t] + proyectos[t] + gastos_com[t] + admin[t] + contrib[t] for t in T]
    ebt = [ingresos[t] - egresos_op[t] for t in T]  # antes de terreno

    # utilidad contable del proyecto (terreno se reconoce como costo de venta)
    costo_terreno_unit = terreno_costo / N_LOTES
    costo_vta_terreno = [ventas_u[t] * costo_terreno_unit for t in T]
    util_total = sum(ingresos) - sum(egresos_op) - terreno_costo
    impuesto_total = max(0.0, util_total) * 0.27

    # impuesto anual simplificado (27% sobre utilidad devengada positiva acumulada)
    imp = [0.0] * (H + 1)
    acum = 0.0
    for t in T:
        base = ingresos[t] - egresos_op[t] - costo_vta_terreno[t]
        acum += base
        if base > 0 and acum > 0:
            imp[min(t + 1, H)] += base * 0.27

    fc = [ebt[t] - pago_terreno[t] - imp[t] for t in T]
    acum, peak = 0.0, 0.0
    for t in T:
        acum += fc[t]
        peak = min(peak, acum)

    res = dict(
        nombre=nombre, ventas_u=ventas_u, ingresos=ingresos, urb=urb,
        gastos_com=gastos_com, pago_terreno=pago_terreno, imp=imp, fc=fc,
        egresos_op=egresos_op,
        ingresos_tot=sum(ingresos), egresos_tot=sum(egresos_op) + terreno_costo,
        util_bruta=sum(ingresos) - sum(egresos_op) - terreno_costo,
        impuesto=impuesto_total,
        util_neta=util_total - impuesto_total,
        capital_max=-peak, ultimo_ano_venta=ultimo_ano_venta,
        tir=irr(fc), van12=npv(fc, 0.12),
        precio_prom=sum(ingresos) / SUP_LOTES,
    )
    res["margen_bruto"] = res["util_bruta"] / res["ingresos_tot"]
    res["margen_neto"] = res["util_neta"] / res["ingresos_tot"]
    return res

out = {}
for n, p in ESC.items():
    out[n] = correr(n, p)

print("=" * 96)
print(f"Paño {PANO_M2:,} m2 | lotes {SUP_LOTES:,} m2 ({N_LOTES} u, prom {SUP_LOTE_PROM:,.0f} m2)")
print(f"Colegio {SUP_COLEGIO:,} | Comercial {SUP_COMERCIAL:,} | AAVV {SUP_AAVV:,} | Vialidad {SUP_VIAL:,}")
print(f"Terreno: total {TERRENO_TOTAL:,.0f} UF = {TERRENO_TOTAL/PANO_M2:.3f} UF/m2 paño; "
      f"{TERRENO_TOTAL/SUP_LOTES:.3f} UF/m2 vendible; {TERRENO_TOTAL/N_LOTES:,.0f} UF/lote")
print(f"Asignación: loteo {TERRENO_LOTEO:,.0f} ({share_loteo:.1%}) | colegio {TERRENO_COLE:,.0f} "
      f"({share_colegio:.1%}) | comercial {TERRENO_COM:,.0f} ({share_comercial:.1%})")
print("=" * 96)

for n, r in out.items():
    print(f"\n### {n}")
    print(f"  Ingresos totales      {r['ingresos_tot']:>12,.0f} UF  (precio prom {r['precio_prom']:.2f} UF/m2)")
    print(f"  Costos totales        {r['egresos_tot']:>12,.0f} UF")
    print(f"  Utilidad antes imp.   {r['util_bruta']:>12,.0f} UF   margen {r['margen_bruto']:.1%}")
    print(f"  Impuesto 27%          {r['impuesto']:>12,.0f} UF")
    print(f"  Utilidad neta         {r['util_neta']:>12,.0f} UF   margen {r['margen_neto']:.1%}")
    print(f"  Capital máx. expuesto {r['capital_max']:>12,.0f} UF")
    print(f"  TIR proyecto          {r['tir']*100 if r['tir'] else 0:>11.1f} %")
    print(f"  VAN @12%              {r['van12']:>12,.0f} UF")
    print(f"  Último año de venta   {r['ultimo_ano_venta']:>12}")
    print("  Año :  " + " ".join(f"{t:>8}" for t in range(len(r['fc']))))
    print("  Uds :  " + " ".join(f"{v:>8.0f}" for v in r['ventas_u']))
    print("  Ingr:  " + " ".join(f"{v:>8,.0f}" for v in r['ingresos']))
    print("  Urb :  " + " ".join(f"{v:>8,.0f}" for v in r['urb']))
    print("  Terr:  " + " ".join(f"{v:>8,.0f}" for v in r['pago_terreno']))
    print("  FC  :  " + " ".join(f"{v:>8,.0f}" for v in r['fc']))
    ac = 0; acs = []
    for v in r['fc']:
        ac += v; acs.append(ac)
    print("  FCac:  " + " ".join(f"{v:>8,.0f}" for v in acs))

# ---------------- PUNTO DE EQUILIBRIO ----------------
print("\n" + "=" * 96)
print("PUNTO DE EQUILIBRIO (escenario Base)")
p = ESC["Base"]
costos_fijos = p["urb"] + TERRENO_TOTAL + 14_000 + 2_500 * 6
for pr in (3.5, 4.0):
    neto_lote = SUP_LOTE_PROM * pr * (1 - p["gasto_com"])
    print(f"  a {pr} UF/m2 -> ingreso neto/lote {neto_lote:,.0f} UF -> "
          f"equilibrio {costos_fijos/neto_lote:.1f} lotes ({costos_fijos/neto_lote/N_LOTES:.0%} del proyecto)")
    print(f"     lotes para cubrir TERRENO completo (119.000): {TERRENO_TOTAL/neto_lote:.1f}")
    print(f"     lotes para cubrir SALDO (99.000):             {SALDO/neto_lote:.1f}")

# ---------------- MÁXIMO PRECIO DE TERRENO (residual) ----------------
print("\n" + "=" * 96)
print("VALOR RESIDUAL DEL TERRENO (¿cuánto pagar como máximo?)")
for esc in ("Conservador", "Base", "Optimista"):
    print(f"  --- escenario {esc}")
    for tir_obj in (0.15, 0.18, 0.22):
        lo, hi = 1_000.0, 400_000.0
        for _ in range(60):
            mid = (lo + hi) / 2
            r = correr("x", ESC[esc], precio_terreno=mid, pie=mid * 0.168)
            if npv(r["fc"], tir_obj) > 0:
                lo = mid
            else:
                hi = mid
        print(f"     TIR objetivo {tir_obj:.0%} -> precio máximo {lo:>9,.0f} UF "
              f"({lo/PANO_M2:.2f} UF/m2 paño, {lo/N_LOTES:,.0f} UF/lote)")

json.dump({k: {kk: vv for kk, vv in v.items()} for k, v in out.items()},
          open('/tmp/claude-0/-home-user-ali/7087cd42-a8be-5db7-86f2-2c10857f429c/scratchpad/out.json', 'w'))
