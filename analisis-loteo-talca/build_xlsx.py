# -*- coding: utf-8 -*-
"""Genera el modelo financiero en Excel con fórmulas vivas."""
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

INK = "17212A"; BLUE = "2C5D7C"; WASH = "E2EAEF"; GREY = "E9EBE4"; RULE = "D3D7CD"
thin = Side(style="thin", color=RULE)
bd = Border(bottom=thin)
H = Font(bold=True, color="FFFFFF", size=10)
FILLH = PatternFill("solid", fgColor=BLUE)
FILLW = PatternFill("solid", fgColor=WASH)
FILLG = PatternFill("solid", fgColor=GREY)
TIT = Font(bold=True, size=13, color=INK)
LBL = Font(bold=True, size=10, color=BLUE)
IN = Font(color="9C3B2E", bold=True)   # celdas de input

wb = Workbook()

# ============================== SUPUESTOS ==============================
ws = wb.active; ws.title = "Supuestos"
ws.column_dimensions["A"].width = 46
for c in "BCDE": ws.column_dimensions[c].width = 15
ws.column_dimensions["F"].width = 58

def head(ws, row, cells):
    for i, v in enumerate(cells):
        c = ws.cell(row=row, column=i + 1, value=v); c.font = H; c.fill = FILLH
        c.alignment = Alignment(horizontal="center" if i else "left")

ws["A1"] = "MODELO — LOTEO 19,26 HA · AV. SAN MIGUEL 6850, TALCA"; ws["A1"].font = TIT
ws["A2"] = "Las celdas en rojo son inputs. Todo lo demás se calcula."; ws["A2"].font = Font(italic=True, size=9)

ws["A4"] = "DATOS DUROS (planos L_02 / L_03, agosto 2023)"; ws["A4"].font = LBL
datos = [
    ("Paño fusionado", 192627, "m²", "Cuadro de fusión L_02"),
    ("Superficie de los 90 sitios", 127866, "m²", "Suma cuadro de superficies L_03"),
    ("N° de sitios", 90, "u", "Listado de lotes L_03"),
    ("Paño colegio", 18619, "m²", "L_03"),
    ("Paño locales comerciales", 4386, "m²", "L_03"),
    ("Áreas verdes", 13798, "m²", "11.649 + 2.149, L_03"),
    ("Vialidad + expropiación", 27958, "m²", "Por diferencia"),
]
r = 5
head(ws, r, ["Partida", "Valor", "Unidad", "", "", "Fuente"]); r += 1
for n, v, u, f in datos:
    ws.cell(row=r, column=1, value=n).border = bd
    c = ws.cell(row=r, column=2, value=v); c.number_format = "#,##0"; c.border = bd
    ws.cell(row=r, column=3, value=u).border = bd
    ws.cell(row=r, column=6, value=f).font = Font(size=9, italic=True)
    r += 1
ws["B13"] = "=B6/B7"; ws["A13"] = "Superficie promedio por sitio"; ws["B13"].number_format = "#,##0"
ws["C13"] = "m²"
r = 15

ws.cell(row=r, column=1, value="INPUTS — TERRENO").font = LBL; r += 1
head(ws, r, ["Variable", "Valor", "Unidad", "", "", "Comentario"]); r += 1
terreno = [
    ("Precio del terreno", 119000, "UF", "Precio pedido por el vendedor"),
    ("Pie", 10000, "UF", "Propuesto: 10.000 en vez de 20.000"),
    ("% de cada venta destinado al terreno", 0.35, "%", "35% para caber en el plazo de 5 años"),
    ("Plazo máximo para pagar el terreno", 5, "años", "Debe contarse desde el permiso de loteo"),
]
FILA = {}
for n, v, u, f in terreno:
    ws.cell(row=r, column=1, value=n).border = bd
    c = ws.cell(row=r, column=2, value=v); c.font = IN; c.border = bd
    c.number_format = "0%" if u == "%" else "#,##0"
    ws.cell(row=r, column=3, value=u).border = bd
    ws.cell(row=r, column=6, value=f).font = Font(size=9, italic=True)
    FILA[n] = r; r += 1
ws.cell(row=r, column=1, value="Saldo contra flujo")
ws.cell(row=r, column=2, value=f"=B{FILA['Precio del terreno']}-B{FILA['Pie']}").number_format = "#,##0"
ws.cell(row=r, column=3, value="UF"); FILA["saldo"] = r; r += 2

ws.cell(row=r, column=1, value="INPUTS — ESCENARIOS").font = LBL; r += 1
head(ws, r, ["Variable", "Conservador", "Base", "Optimista", "", "Comentario"]); r += 1
esc = [
    ("Sitios vendidos por año", 10, 15, 21, "#,##0", "El supuesto que decide el negocio"),
    ("Año de inicio de ventas", 3, 2, 1, "0", "Depende de permisos y factibilidad"),
    ("Precio inicial", 3.3, 3.5, 3.5, "0.00", "UF/m²"),
    ("Precio maduro", 3.8, 4.0, 4.2, "0.00", "UF/m², desde el año 3 de venta"),
    ("Año de venta en que sube el precio", 4, 3, 2, "0", "1 = primer año de venta"),
    ("Urbanización total (IVA incluido)", 185000, 155000, 135000, "#,##0", "UF — cotizar con 3 contratistas"),
    ("Gasto comercial", 0.055, 0.045, 0.040, "0.0%", "% sobre ventas"),
    ("Administración anual", 3000, 2500, 2500, "#,##0", "UF/año"),
    ("Proyectos y permisos año 0", 9000, 9000, 9000, "#,##0", "UF"),
    ("Proyectos y permisos año 1", 5000, 5000, 5000, "#,##0", "UF"),
    ("Contribuciones anuales", 500, 500, 500, "#,##0", "UF/año, incluye sobretasa sitio eriazo"),
    ("Impuesto a la renta", 0.27, 0.27, 0.27, "0%", "Primera categoría"),
    ("Tasa de descuento", 0.12, 0.12, 0.12, "0%", "Costo de capital del desarrollador"),
    ("Preventa cobrada un año antes", 0.20, 0.20, 0.20, "0%", "Pie de promesa"),
]
SUP = {}
for n, a, b, cc, fmt, com in esc:
    ws.cell(row=r, column=1, value=n).border = bd
    for i, v in enumerate((a, b, cc)):
        c = ws.cell(row=r, column=2 + i, value=v); c.font = IN; c.number_format = fmt; c.border = bd
        c.alignment = Alignment(horizontal="center")
    ws.cell(row=r, column=6, value=com).font = Font(size=9, italic=True)
    SUP[n] = r; r += 1

ws.freeze_panes = "A5"

# ============================== FLUJO POR ESCENARIO ==============================
COL = {"Conservador": "B", "Base": "C", "Optimista": "D"}
for esc_name in ("Conservador", "Base", "Optimista"):
    s = wb.create_sheet(f"Flujo {esc_name}")
    k = COL[esc_name]
    s.column_dimensions["A"].width = 40
    N = 15
    for i in range(N + 1):
        s.column_dimensions[get_column_letter(2 + i)].width = 12
    s["A1"] = f"FLUJO DE CAJA — ESCENARIO {esc_name.upper()}"; s["A1"].font = TIT
    s["A2"] = "Todos los valores en UF. Cambiar supuestos en la hoja 'Supuestos'."
    s["A2"].font = Font(italic=True, size=9)

    hdr = ["Concepto"] + [f"Año {i}" for i in range(N + 1)]
    head(s, 4, hdr)

    def rowfill(row, label, formula, fmt="#,##0", bold=False, fill=None):
        c = s.cell(row=row, column=1, value=label)
        if bold: c.font = Font(bold=True)
        if fill: c.fill = fill
        for i in range(N + 1):
            cell = s.cell(row=row, column=2 + i, value=formula(i, get_column_letter(2 + i)))
            cell.number_format = fmt
            if bold: cell.font = Font(bold=True)
            if fill: cell.fill = fill
        return row

    S = "Supuestos!"
    ritmo = f"{S}${k}${SUP['Sitios vendidos por año']}"
    ini   = f"{S}${k}${SUP['Año de inicio de ventas']}"
    p0    = f"{S}${k}${SUP['Precio inicial']}"
    p1    = f"{S}${k}${SUP['Precio maduro']}"
    ysub  = f"{S}${k}${SUP['Año de venta en que sube el precio']}"
    urbt  = f"{S}${k}${SUP['Urbanización total (IVA incluido)']}"
    gc    = f"{S}${k}${SUP['Gasto comercial']}"
    adm   = f"{S}${k}${SUP['Administración anual']}"
    pr0   = f"{S}${k}${SUP['Proyectos y permisos año 0']}"
    pr1   = f"{S}${k}${SUP['Proyectos y permisos año 1']}"
    con   = f"{S}${k}${SUP['Contribuciones anuales']}"
    tax   = f"{S}${k}${SUP['Impuesto a la renta']}"
    disc  = f"{S}${k}${SUP['Tasa de descuento']}"
    prev  = f"{S}${k}${SUP['Preventa cobrada un año antes']}"
    m2    = f"{S}$B$13"
    nlot  = f"{S}$B$7"
    pterr = f"{S}$B${FILA['Precio del terreno']}"
    ppie  = f"{S}$B${FILA['Pie']}"
    ppct  = f"{S}$B${FILA['% de cada venta destinado al terreno']}"
    pplazo= f"{S}$B${FILA['Plazo máximo para pagar el terreno']}"

    # fila 5: año índice
    r5 = 5
    s.cell(row=r5, column=1, value="Año").font = Font(bold=True)
    for i in range(N + 1):
        s.cell(row=r5, column=2 + i, value=i).font = Font(bold=True)

    # 6 sitios vendidos acumulados previos
    r_prev = 6
    s.cell(row=r_prev, column=1, value="Sitios vendidos acumulados (previo)")
    for i in range(N + 1):
        col = get_column_letter(2 + i)
        s.cell(row=r_prev, column=2 + i,
               value="=0" if i == 0 else f"={get_column_letter(1 + i)}{r_prev}+{get_column_letter(1+i)}7").number_format = "#,##0"

    r_u = 7
    s.cell(row=r_u, column=1, value="Sitios vendidos en el año").font = Font(bold=True)
    for i in range(N + 1):
        col = get_column_letter(2 + i)
        s.cell(row=r_u, column=2 + i,
               value=f"=IF({i}<{ini},0,MIN({ritmo},{nlot}-{col}{r_prev}))").number_format = "#,##0"

    r_p = 8
    s.cell(row=r_p, column=1, value="Precio del año (UF/m²)")
    for i in range(N + 1):
        col = get_column_letter(2 + i)
        s.cell(row=r_p, column=2 + i,
               value=f"=IF({i}<{ini},0,IF({i}-{ini}+1>={ysub},{p1},{p0}))").number_format = "0.00"

    r_ing = 9
    s.cell(row=r_ing, column=1, value="Ingresos por venta").font = Font(bold=True)
    for i in range(N + 1):
        col = get_column_letter(2 + i)
        s.cell(row=r_ing, column=2 + i, value=f"={col}{r_u}*{m2}*{col}{r_p}").number_format = "#,##0"

    r_caja = 10
    s.cell(row=r_caja, column=1, value="Caja por ventas (20% anticipado)")
    for i in range(N + 1):
        col = get_column_letter(2 + i); nxt = get_column_letter(3 + i)
        if i < N:
            s.cell(row=r_caja, column=2 + i,
                   value=f"={col}{r_ing}*(1-{prev})+{nxt}{r_ing}*{prev}").number_format = "#,##0"
        else:
            s.cell(row=r_caja, column=2 + i, value=f"={col}{r_ing}*(1-{prev})").number_format = "#,##0"

    r_urb = 12
    s.cell(row=r_urb, column=1, value="Urbanización (4 macro-etapas)")
    for i in range(N + 1):
        col = get_column_letter(2 + i)
        s.cell(row=r_urb, column=2 + i,
               value=f"={urbt}*(IF({i}={ini}-1,0.3,0)+IF({i}={ini},0.25,0)+IF({i}={ini}+2,0.25,0)+IF({i}={ini}+4,0.2,0))"
               ).number_format = "#,##0"

    r_proy = 13
    s.cell(row=r_proy, column=1, value="Proyectos, permisos y especialidades")
    for i in range(N + 1):
        s.cell(row=r_proy, column=2 + i,
               value=f"={pr0}" if i == 0 else (f"={pr1}" if i == 1 else 0)).number_format = "#,##0"

    r_gc = 14
    s.cell(row=r_gc, column=1, value="Gasto comercial")
    for i in range(N + 1):
        col = get_column_letter(2 + i)
        s.cell(row=r_gc, column=2 + i, value=f"={col}{r_ing}*{gc}").number_format = "#,##0"

    r_ad = 15
    s.cell(row=r_ad, column=1, value="Administración y contribuciones")
    for i in range(N + 1):
        col = get_column_letter(2 + i)
        s.cell(row=r_ad, column=2 + i,
               value=f"=IF(OR({col}{r_u}>0,{i}<{ini}),{adm}+{con},0)").number_format = "#,##0"

    r_eg = 16
    rowfill(r_eg, "Total egresos operacionales",
            lambda i, col: f"={col}{r_urb}+{col}{r_proy}+{col}{r_gc}+{col}{r_ad}", bold=True, fill=FILLG)

    r_ter = 18
    s.cell(row=r_ter, column=1, value="Pago del terreno").font = Font(bold=True)
    for i in range(N + 1):
        col = get_column_letter(2 + i); pcol = get_column_letter(1 + i)
        if i == 0:
            s.cell(row=r_ter, column=2, value=f"={ppie}").number_format = "#,##0"
        else:
            s.cell(row=r_ter, column=2 + i,
                   value=(f"=IF({i}>={pplazo},MAX(0,{pterr}-SUM($B{r_ter}:{pcol}{r_ter})),"
                          f"MIN({col}{r_caja}*{ppct},MAX(0,{pterr}-SUM($B{r_ter}:{pcol}{r_ter}))))")
                   ).number_format = "#,##0"
    s.cell(row=r_ter + 1, column=1, value="Saldo del terreno pendiente")
    for i in range(N + 1):
        col = get_column_letter(2 + i)
        s.cell(row=r_ter + 1, column=2 + i,
               value=f"=MAX(0,{pterr}-SUM($B{r_ter}:{col}{r_ter}))").number_format = "#,##0"

    r_imp = 20
    s.cell(row=r_imp, column=1, value="Impuesto a la renta (pagado al año siguiente)")
    for i in range(N + 1):
        col = get_column_letter(2 + i); pcol = get_column_letter(1 + i)
        if i == 0:
            s.cell(row=r_imp, column=2, value=0).number_format = "#,##0"
        else:
            s.cell(row=r_imp, column=2 + i,
                   value=f"=MAX(0,({pcol}{r_ing}-{pcol}{r_eg}-{pcol}{r_u}*{pterr}*0.881/{nlot})*{tax})"
                   ).number_format = "#,##0"

    r_fc = 22
    rowfill(r_fc, "FLUJO DE CAJA DEL PERÍODO",
            lambda i, col: f"={col}{r_caja}-{col}{r_eg}-{col}{r_ter}-{col}{r_imp}", bold=True, fill=FILLW)
    r_ac = 23
    s.cell(row=r_ac, column=1, value="Flujo acumulado").font = Font(bold=True)
    for i in range(N + 1):
        col = get_column_letter(2 + i); pcol = get_column_letter(1 + i)
        s.cell(row=r_ac, column=2 + i,
               value=f"={col}{r_fc}" if i == 0 else f"={pcol}{r_ac}+{col}{r_fc}").number_format = "#,##0"

    # indicadores
    s.cell(row=25, column=1, value="INDICADORES").font = LBL
    ind = [
        ("Ingresos totales", f"=SUM(B{r_ing}:{get_column_letter(2+N)}{r_ing})", "#,##0"),
        ("Costos totales (con terreno)", f"=SUM(B{r_eg}:{get_column_letter(2+N)}{r_eg})+{pterr}*0.881", "#,##0"),
        ("Utilidad antes de impuesto", f"=B26-B27", "#,##0"),
        ("Margen bruto", f"=B28/B26", "0.0%"),
        ("Impuesto", f"=B28*{tax}", "#,##0"),
        ("Utilidad neta", f"=B28-B30", "#,##0"),
        ("Margen neto", f"=B31/B26", "0.0%"),
        ("Capital máximo expuesto", f"=-MIN(B{r_ac}:{get_column_letter(2+N)}{r_ac},0)", "#,##0"),
        ("TIR del proyecto", f"=IRR(B{r_fc}:{get_column_letter(2+N)}{r_fc})", "0.0%"),
        ("VAN a la tasa de descuento", f"=NPV({disc},C{r_fc}:{get_column_letter(2+N)}{r_fc})+B{r_fc}", "#,##0"),
        ("Precio promedio logrado (UF/m²)", f"=B26/{S}$B$6", "0.00"),
        ("Saldo impago al vencer el plazo", f"=INDEX(B{r_ter+1}:{get_column_letter(2+N)}{r_ter+1},{pplazo}+1)", "#,##0"),
    ]
    rr = 26
    for n_, f_, fmt in ind:
        s.cell(row=rr, column=1, value=n_).font = Font(bold=True)
        c = s.cell(row=rr, column=2, value=f_); c.number_format = fmt; c.font = Font(bold=True); c.fill = FILLW
        rr += 1
    s.freeze_panes = "B5"

# ============================== ETAPAS 2 Y 3 ==============================
s = wb.create_sheet("Etapas 2 y 3")
s.column_dimensions["A"].width = 42
for c in "BCD": s.column_dimensions[c].width = 15
s.column_dimensions["E"].width = 50
s["A1"] = "ACTIVOS DE RENTA — STRIP CENTER, COLEGIO Y ESTACIÓN DE SERVICIO"; s["A1"].font = TIT

r = 3
s.cell(row=r, column=1, value="ETAPA 2 — STRIP CENTER (terreno 4.386 m²)").font = LBL; r += 1
head(s, r, ["Variable", "Conservador", "Base", "Optimista", "Comentario"]); r += 1
sc = [
    ("Superficie arrendable (m²)", 1150, 1400, 1600, "#,##0", "~32% de ocupación del paño"),
    ("Renta (UF/m²/mes)", 0.28, 0.35, 0.42, "0.00", "Referencia RM: 0,69 en primer piso"),
    ("Vacancia", 0.15, 0.08, 0.05, "0%", ""),
    ("Costo de construcción (UF/m²)", 27, 24, 22, "#,##0", "Shell & core"),
    ("Obras exteriores y empalmes (UF)", 6000, 6000, 6000, "#,##0", "Estacionamientos, paisajismo"),
    ("Costos blandos", 0.10, 0.10, 0.10, "0%", "Proyectos, permisos, gerencia"),
    ("Terreno asignado (UF)", 2710, 2710, 2710, "#,##0", "2,3% de las 119.000 UF"),
    ("Gastos no recuperables", 0.12, 0.12, 0.12, "0%", "Contribuciones, administración"),
    ("Cap rate de salida", 0.095, 0.085, 0.075, "0.0%", "Chile 5,8–7,5%; premio regional"),
]
SC = {}
for n, a, b, c_, fmt, com in sc:
    s.cell(row=r, column=1, value=n).border = bd
    for i, v in enumerate((a, b, c_)):
        cc = s.cell(row=r, column=2 + i, value=v); cc.font = IN; cc.number_format = fmt
        cc.alignment = Alignment(horizontal="center"); cc.border = bd
    s.cell(row=r, column=5, value=com).font = Font(size=9, italic=True)
    SC[n] = r; r += 1
res_sc = [
    ("Inversión total (UF)", lambda k: f"={k}{SC['Superficie arrendable (m²)']}*{k}{SC['Costo de construcción (UF/m²)']}*(1+{k}{SC['Costos blandos']})+{k}{SC['Obras exteriores y empalmes (UF)']}+{k}{SC['Terreno asignado (UF)']}", "#,##0"),
    ("Renta bruta anual (UF)", lambda k: f"={k}{SC['Superficie arrendable (m²)']}*{k}{SC['Renta (UF/m²/mes)']}*12", "#,##0"),
    ("NOI anual (UF)", lambda k: f"={k}{r+1}*(1-{k}{SC['Vacancia']})*(1-{k}{SC['Gastos no recuperables']})", "#,##0"),
    ("Yield on cost", lambda k: f"={k}{r+2}/{k}{r}", "0.0%"),
    ("Valor estabilizado (UF)", lambda k: f"={k}{r+2}/{k}{SC['Cap rate de salida']}", "#,##0"),
    ("Creación de valor (UF)", lambda k: f"={k}{r+4}-{k}{r}", "#,##0"),
    ("Payback (años)", lambda k: f"={k}{r}/{k}{r+2}", "0.0"),
]
for j, (n_, f_, fmt) in enumerate(res_sc):
    s.cell(row=r + j, column=1, value=n_).font = Font(bold=True)
    for i, k in enumerate("BCD"):
        cc = s.cell(row=r + j, column=2 + i, value=f_(k)); cc.number_format = fmt
        cc.font = Font(bold=True); cc.fill = FILLW
r += len(res_sc) + 2

s.cell(row=r, column=1, value="ETAPA 3 — COMPARACIÓN DE ALTERNATIVAS PARA EL PAÑO NORTE (18.619 m²)").font = LBL; r += 1
head(s, r, ["", "Colegio build-to-suit", "Venta del paño", "EDS arrendada", "Comentario"]); r += 1
comp = [
    ("Inversión propia (UF)", 255102, 0, 4859, "#,##0", "EDS: sólo accesos, EISTU y empalmes"),
    ("Flujo anual (UF)", 22230, 0, 4200, "#,##0", "EDS: canon de 350 UF/mes"),
    ("Rentabilidad sobre costo", 0.087, 0, 0.864, "0.0%", ""),
    ("Valor del activo (UF)", 261529, 46548, 56000, "#,##0", "Venta del paño a 2,5 UF/m²"),
    ("Payback (años)", 11.5, 0, 1.2, "0.0", ""),
    ("Superficie que ocupa (m²)", 18619, 18619, 2200, "#,##0", "La EDS deja 16.400 m² libres"),
]
for n, a, b, c_, fmt, com in comp:
    s.cell(row=r, column=1, value=n).border = bd
    for i, v in enumerate((a, b, c_)):
        cc = s.cell(row=r, column=2 + i, value=v); cc.number_format = fmt
        cc.alignment = Alignment(horizontal="center"); cc.border = bd
    s.cell(row=r, column=5, value=com).font = Font(size=9, italic=True)
    r += 1

r += 1
s.cell(row=r, column=1, value="Requisito duro para la EDS: TMDA de Av. San Miguel sobre 8.000–12.000 veh/día "
                              "para atraer a un operador de marca. Verificar en Dirección de Vialidad del Maule."
      ).font = Font(italic=True, size=10, color="9C3B2E")

wb.save("/tmp/claude-0/-home-user-ali/7087cd42-a8be-5db7-86f2-2c10857f429c/scratchpad/Modelo_Loteo_Talca.xlsx")
print("ok")
