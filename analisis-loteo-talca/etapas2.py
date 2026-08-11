# -*- coding: utf-8 -*-
"""Etapas 2 y 3 con los datos reales de las láminas L_05, L_08 y L_09."""
UF = 40_846.0
TERRENO_COM, TERRENO_COLE = 2_710.0, 11_502.0

print("="*96)
print("ETAPA 2 — CENTRO COMERCIAL SEGÚN LÁMINA L_05 (no era un strip center de 1.400 m²)")
print("  Programa real: 8 locales de 38,4 m² + 2 restaurantes de 156 m² + administración 76 m²")
print("                 + baños y camarines 42,5 m² + 4 canchas de pádel + control de acceso")
print("  Total equipamiento comercial: 729,7 m² · Superficie ARRENDABLE: 619,2 m²")
LOC, RES = 8*38.4, 2*156.0
CONSTR = 729.7
for e, r_loc, r_res, vac, cm2, cap, padel_neto, padel_inv in [
        ("Conservador", 0.32, 0.24, 0.15, 27, 0.095, 500, 4_200),
        ("Base",        0.40, 0.30, 0.08, 24, 0.085, 900, 3_500),
        ("Optimista",   0.48, 0.36, 0.05, 22, 0.075, 1_350, 3_200)]:
    bruto = (LOC*r_loc + RES*r_res)*12
    noi_loc = bruto*(1-vac)*(1-0.12)
    noi = noi_loc + padel_neto
    inv = CONSTR*cm2*1.10 + padel_inv + 4_500 + TERRENO_COM
    val = noi/cap
    print(f"  {e:<12} renta bruta {bruto:>6,.0f} | NOI locales {noi_loc:>6,.0f} + pádel {padel_neto:>5,.0f} = {noi:>6,.0f} UF/año")
    print(f"  {'':<12} inversión {inv:>7,.0f} UF | yield on cost {noi/inv:5.1%} | valor @cap {cap:.1%} = {val:>7,.0f} UF"
          f" | creación {val-inv:>+7,.0f} UF | payback {inv/noi:4.1f} años")

print()
print("="*96)
print("ETAPA 3A — COLEGIO SEGÚN LÁMINAS L_08 y L_09 (proyecto real, no estimación)")
P1, P2, PATIO = 2_283.0, 1_566.0, 2_088.0
CERR = P1+P2
print(f"  1er piso {P1:,.0f} m² + 2do piso {P2:,.0f} m² = {CERR:,.0f} m² cerrados; patio techado {PATIO:,.0f} m²")
print(f"  Terreno 18.354 m² · áreas verdes 14.248 m² · 98 estacionamientos · 28 salas · 980 alumnos")
print(f"  Ocupación de suelo 0,21 sobre 0,40 permitida -> queda capacidad normativa sin usar")
for e, cm2, cpatio, ext, renta, cap in [
        ("Conservador", 32, 11, 26_000, 0.24, 0.095),
        ("Base",        28,  9, 22_000, 0.28, 0.085),
        ("Optimista",   26,  8, 19_000, 0.32, 0.075)]:
    obra = CERR*cm2 + PATIO*cpatio + ext
    inv = obra*1.12 + TERRENO_COLE
    noi = CERR*renta*12*0.95
    val = noi/cap
    print(f"  {e:<12} inversión {inv:>8,.0f} UF | renta {noi:>7,.0f} UF/año | yield on cost {noi/inv:5.1%}"
          f" | valor @cap {cap:.1%} = {val:>8,.0f} | creación {val-inv:>+8,.0f} | payback {inv/noi:4.1f} años")
print("  Venta del paño sin construir, a 1,5 / 2,5 / 3,5 UF/m²:")
for pr in (1.5,2.5,3.5):
    print(f"     {18_354*pr:>9,.0f} UF  (costo asignado {TERRENO_COLE:,.0f} UF -> {18_354*pr/TERRENO_COLE:.1f}x)")

print()
print("="*96)
print("ETAPA 3B — ESTACIÓN DE SERVICIO (sin cambios: 2.200 m² del paño norte)")
inv_eds = TERRENO_COLE*2200/18_354 + 3_500
for e, canon, cap in [("Conservador",220,0.085),("Base",350,0.075),("Optimista",500,0.070)]:
    anual = canon*12
    print(f"  {e:<12} canon {canon:>4} UF/mes = {anual:>6,.0f} UF/año | inversión {inv_eds:>6,.0f} UF"
          f" | yield {anual/inv_eds:6.1%} | valor @cap {cap:.1%} = {anual/cap:>7,.0f} UF | payback {inv_eds/anual:4.1f} años")
print(f"  Quedan {18_354-2_200:,.0f} m² del paño norte libres para colegio, venta o segundo loteo.")
