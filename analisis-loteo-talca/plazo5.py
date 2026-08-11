# -*- coding: utf-8 -*-
"""Impacto del plazo máximo de 5 años para pagar el terreno."""
import sys, copy; sys.path.insert(0,'.')
from modelo import ESC, correr, npv, irr, N_LOTES, SUP_LOTE_PROM, share_loteo

def flujo_ventas(p):
    H=14; ing=[0.0]*(H+1); uds=[0.0]*(H+1); rest=N_LOTES; k=0
    for t in range(H+1):
        if t<p["inicio_venta"] or rest<=0: continue
        u=min(p["ritmo"],rest); pr=p["precio"][min(k,len(p["precio"])-1)]
        uds[t]=u; ing[t]=u*SUP_LOTE_PROM*pr; rest-=u; k+=1
    return ing,uds

print("VENTAS ACUMULADAS AL AÑO 5 (fin del plazo) Y % DE FLUJO NECESARIO")
print(f"{'Escenario':<13} {'sitios vend.':>12} {'ingresos ac.':>13} {'saldo':>9} {'% de flujo':>11} {'déficit':>10}")
for e in ("Conservador","Base","Optimista"):
    p=ESC[e]; ing,uds=flujo_ventas(p)
    for pie in (10_000,20_000):
        ac=sum(ing[:6]); u=sum(uds[:6]); saldo=119_000-pie
        pct=saldo/ac if ac else float('inf')
        deficit=max(0.0,saldo-ac)
        print(f"{e+' pie '+str(pie//1000)+'k':<13} {u:>12,.0f} {ac:>13,.0f} {saldo:>9,.0f} {pct:>10.0%} {deficit:>10,.0f}")

print()
print("VIABILIDAD DEL PAGO EN 5 AÑOS: ¿queda caja para urbanizar?")
print("(ingresos acumulados a año 5 - urbanización comprometida - gastos - pago del terreno)")
for e in ("Conservador","Base","Optimista"):
    p=ESC[e]; ing,uds=flujo_ventas(p)
    ac=sum(ing[:6]); urb=p["urb"]*0.75   # 3 de 4 macro-etapas ejecutadas al año 5
    gastos=ac*p["gasto_com"]+p["admin"]*6+14_000+3_000
    for pie in (10_000,20_000):
        libre=ac-urb-gastos-(119_000-pie)
        print(f"  {e:<12} pie {pie//1000:>2}k -> caja disponible tras pagar todo al año 5: {libre:>9,.0f} UF"
              + ("   <-- DEFICIT, requiere aporte de capital" if libre<0 else ""))

print()
print("EFECTO EN TIR/VAN DE FORZAR EL PAGO EN 5 AÑOS (vs. pago contra flujo sin plazo)")
def correr_plazo(p, pie, plazo=5, precio_terreno=119_000.0):
    """Paga el saldo con % de flujo, y lo que falte al año `plazo` como balloon."""
    H=p["horizonte"]; ing,uds=flujo_ventas(p); ing=ing[:H+1]+[0]*(H+1-len(ing[:H+1])); uds=uds[:H+1]
    ing=(ing+[0]*(H+1))[:H+1]; uds=(uds+[0]*(H+1))[:H+1]
    ult=max(t for t in range(H+1) if uds[t]>0)
    urb=[0.0]*(H+1)
    for i,sh in enumerate((0.30,0.25,0.25,0.20)):
        urb[min(p["inicio_venta"]-1+i,H)]+=p["urb"]*sh
    proy=[0.0]*(H+1); proy[0]=9_000; proy[1]=5_000
    gc=[i*p["gasto_com"] for i in ing]
    adm=[p["admin"]+500 if t<=ult else 0 for t in range(H+1)]
    pt=[0.0]*(H+1); pt[0]=pie; pend=precio_terreno-pie
    for t in range(H+1):
        if pend<=0: continue
        if t<=plazo:
            c=min(pend, ing[t]*0.35)
            pt[t]+=c; pend-=c
        if t==plazo and pend>0:
            pt[t]+=pend; pend=0
    cu=precio_terreno*share_loteo/N_LOTES
    imp=[0.0]*(H+1); acu=0
    for t in range(H+1):
        b=ing[t]-(urb[t]+proy[t]+gc[t]+adm[t])-uds[t]*cu; acu+=b
        if b>0 and acu>0: imp[min(t+1,H)]+=b*0.27
    fc=[ing[t]-(urb[t]+proy[t]+gc[t]+adm[t])-pt[t]-imp[t] for t in range(H+1)]
    a=0;peak=0
    for v in fc: a+=v; peak=min(peak,a)
    return dict(fc=fc,pt=pt,peak=-peak,tir=irr(fc),van=npv(fc,0.12))

for e in ("Conservador","Base","Optimista"):
    r5=correr_plazo(ESC[e],10_000,5)
    rl=correr(e,ESC[e],pie=10_000,pct_flujo_terreno=0.25)
    print(f"  {e:<12} con plazo 5 años: capital máx {r5['peak']:>8,.0f} | TIR {r5['tir']*100 if r5['tir'] else 0:5.1f}% | VAN {r5['van']:>8,.0f}")
    print(f"  {'':<12} sin plazo fijo  : capital máx {rl['capital_max']:>8,.0f} | TIR {rl['tir']*100:5.1f}% | VAN {rl['van12']:>8,.0f}")
    print(f"  {'':<12} balloon exigido en el año 5: {r5['pt'][5]:,.0f} UF")
