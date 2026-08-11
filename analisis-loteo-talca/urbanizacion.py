# -*- coding: utf-8 -*-
"""Reconciliación del costo de urbanización con el documento del cliente."""
UF = 40_846.0
M = 1_000_000

print("=" * 92)
print("DOCUMENTO DEL CLIENTE — 'Resumen estimado por 1 km de urbanización interna'")
items = [("Calles y veredas",90,150),("Alcantarillado",120,180),("Agua potable",60,100),
         ("Electricidad",50,150),("Otros (10-15%)",32,58)]
lo=hi=0
for n,a,b in items:
    lo+=a; hi+=b
    print(f"  {n:<26} ${a:>4}M – ${b:>4}M CLP/km   =  {a*M/UF:>7,.0f} – {b*M/UF:>7,.0f} UF/km")
print(f"  {'SUBTOTAL por km':<26} ${lo:>4}M – ${hi:>4}M CLP/km   =  {lo*M/UF:>7,.0f} – {hi*M/UF:>7,.0f} UF/km")
print(f"  {'Portería (una sola vez)':<26} $  25M – $  40M CLP      =  {25*M/UF:>7,.0f} – {40*M/UF:>7,.0f} UF")
print(f"\n  Costo unitario implícito: ${lo*M/1000:,.0f} – ${hi*M/1000:,.0f} CLP por metro lineal")
print(f"                            {lo*M/1000/UF:.1f} – {hi*M/1000/UF:.1f} UF por metro lineal")

print()
print("=" * 92)
print("PROBLEMA 1 — EL LOTEO NO TIENE 1 KM DE CALLES")
area_calles = 26_114
print(f"  Superficie de vialidad interior (L_03, sin expropiación): {area_calles:,} m²")
for c1 in (500, 650, 800):
    y = (area_calles - 18*c1)/11
    print(f"    si Calle 1 (18 m) mide {c1} m -> Calle 2 (11 m) mide {y:,.0f} m -> total {c1+y:,.0f} m lineales")
L = 2000
print(f"  Se adopta {L:,} m lineales (2,0 km) como longitud de trabajo -> el presupuesto del cliente")
print(f"  hay que multiplicarlo por 2, no por 1.")
print(f"    Aplicando SUS costos a 2,0 km: {lo*M*2/UF:,.0f} – {hi*M*2/UF:,.0f} UF")

print()
print("=" * 92)
print("PROBLEMA 2 — PARTIDAS QUE EL RESUMEN NO INCLUYE")
por_ml = [
    ("Movimiento de tierras y rasante", 20_000, 40_000),
    ("Aguas lluvias (cotas 149–163, canales, tranque)", 45_000, 90_000),
]
fijas = [
    ("Cierre perimetral (~2.100 ml)", 95, 147),
    ("Áreas verdes ejecutadas (13.798 m²)", 166, 276),
    ("Canales y servidumbres: 5 tramos, 2 entubados", 60, 120),
    ("Empalmes y aportes reembolsables (90 arranques)", 90, 180),
    ("Proyectos, especialidades, ITO, permisos y garantías", 150, 260),
]
sub_ml_lo=sub_ml_hi=0
for n,a,b in por_ml:
    sub_ml_lo+=a; sub_ml_hi+=b
    print(f"  {n:<50} ${a:>7,}–${b:>7,} CLP/ml -> {a*L/UF:>6,.0f} – {b*L/UF:>6,.0f} UF")
sub_f_lo=sub_f_hi=0
for n,a,b in fijas:
    sub_f_lo+=a; sub_f_hi+=b
    print(f"  {n:<50} ${a:>4}M–${b:>4}M CLP      -> {a*M/UF:>6,.0f} – {b*M/UF:>6,.0f} UF")
falt_lo = sub_ml_lo*L/UF + sub_f_lo*M/UF
falt_hi = sub_ml_hi*L/UF + sub_f_hi*M/UF
print(f"  {'TOTAL PARTIDAS OMITIDAS':<50} {'':<24} -> {falt_lo:>6,.0f} – {falt_hi:>6,.0f} UF")

print()
print("=" * 92)
print("PRESUPUESTO RECONCILIADO (con IVA incluido)")
base_lo = lo*M*2/UF; base_hi = hi*M*2/UF
port_lo, port_hi = 25*M/UF, 40*M/UF
t_lo = base_lo + falt_lo + port_lo
t_hi = base_hi + falt_hi + port_hi
print(f"  Partidas del resumen del cliente, a 2,0 km      {base_lo:>8,.0f} – {base_hi:>8,.0f} UF")
print(f"  Partidas omitidas                              {falt_lo:>8,.0f} – {falt_hi:>8,.0f} UF")
print(f"  Portería y control de acceso                   {port_lo:>8,.0f} – {port_hi:>8,.0f} UF")
print(f"  {'SUBTOTAL':<46} {t_lo:>8,.0f} – {t_hi:>8,.0f} UF")
print(f"  Imprevistos 10%                                {t_lo*.1:>8,.0f} – {t_hi*.1:>8,.0f} UF")
print(f"  {'TOTAL':<46} {t_lo*1.1:>8,.0f} – {t_hi*1.1:>8,.0f} UF")
print()
print(f"  Por sitio:        {t_lo*1.1/90:>8,.0f} – {t_hi*1.1/90:>8,.0f} UF/sitio")
print(f"  Por m² vendible:  {t_lo*1.1/127_866:>8,.2f} – {t_hi*1.1/127_866:>8,.2f} UF/m²")
print()
print("  ESCENARIOS ADOPTADOS:  Optimista 45.000 · Base 60.000 · Conservador 80.000 UF")
print("  (mi estimación anterior era 135.000 / 155.000 / 185.000 UF: estaba entre 2,3x y 2,6x alta)")
