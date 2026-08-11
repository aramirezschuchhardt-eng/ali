# -*- coding: utf-8 -*-
"""Estructura optimizada: pie menor, urbanización en 4 macro-etapas, preventa con 20% anticipado."""
import sys; sys.path.insert(0,'/tmp/claude-0/-home-user-ali/7087cd42-a8be-5db7-86f2-2c10857f429c/scratchpad')
from modelo import (N_LOTES, SUP_LOTE_PROM, share_loteo, irr, npv)

def run(ritmo=15, urb_tot=155_000, precios=(3.5,3.5,4.0,4.0,4.1,4.2,4.2,4.2),
        inicio=2, pie=10_000, precio_terreno=119_000.0, pct=0.25,
        urb_split=(0.30,0.25,0.25,0.20), preventa=0.20, H=12, gc=0.045, admin=2_500):
    ing=[0.0]*(H+1); uds=[0.0]*(H+1); rest=N_LOTES; k=0
    for t in range(H+1):
        if t<inicio or rest<=0: continue
        u=min(ritmo,rest); pr=precios[min(k,len(precios)-1)]
        uds[t]=u; ing[t]=u*SUP_LOTE_PROM*pr; rest-=u; k+=1
    ult=max(t for t in range(H+1) if uds[t]>0)
    # caja: 20% del precio se cobra un año antes (promesa), 80% a la escrituración
    caja=[0.0]*(H+1)
    for t in range(H+1):
        if ing[t]==0: continue
        caja[max(t-1,0)]+=ing[t]*preventa
        caja[t]+=ing[t]*(1-preventa)
    urb=[0.0]*(H+1)
    for i,s in enumerate(urb_split):
        urb[min(inicio-1+i,H)]+=urb_tot*s
    proy=[0.0]*(H+1); proy[0]=9_000; proy[1]=5_000
    gcom=[i*gc for i in ing]
    adm=[admin if t<=ult+1 else 0 for t in range(H+1)]
    con=[500 if t<=ult else 0 for t in range(H+1)]
    pt=[0.0]*(H+1); pt[0]=pie; pend=precio_terreno-pie
    for t in range(H+1):
        if pend<=0 or caja[t]<=0: continue
        c=min(pend,caja[t]*pct); pt[t]+=c; pend-=c
    if pend>0: pt[ult]+=pend
    terreno_costo=precio_terreno*share_loteo; cu=terreno_costo/N_LOTES
    imp=[0.0]*(H+1); ac=0
    for t in range(H+1):
        b=ing[t]-(urb[t]+proy[t]+gcom[t]+adm[t]+con[t])-uds[t]*cu
        ac+=b
        if b>0 and ac>0: imp[min(t+1,H)]+=b*0.27
    fc=[caja[t]-(urb[t]+proy[t]+gcom[t]+adm[t]+con[t])-pt[t]-imp[t] for t in range(H+1)]
    a=0; peak=0
    for v in fc:
        a+=v; peak=min(peak,a)
    util=sum(ing)-sum(urb)-sum(proy)-sum(gcom)-sum(adm)-sum(con)-terreno_costo
    return dict(fc=fc,caja=caja,uds=uds,ing=ing,urb=urb,pt=pt,peak=-peak,tir=irr(fc),
                van=npv(fc,0.12),util=util,neta=util*0.73,ult=ult,
                margen=util*0.73/sum(ing))

print("ESTRUCTURA OPTIMIZADA vs ESTRUCTURA SIMPLE (escenario Base: 15 lotes/año, urb 155k)")
for nom,kw in [("Simple (pie 20k, urb 3 etapas, sin preventa)",dict(pie=20_000,urb_split=(0.45,0,0.30,0.25),preventa=0.0)),
               ("Optimizada (pie 10k, urb 4 etapas, preventa 20%)",dict())]:
    r=run(**kw)
    print(f"\n{nom}")
    print(f"  capital máximo expuesto {r['peak']:>9,.0f} UF | TIR {r['tir']*100:5.1f}% | VAN12 {r['van']:>8,.0f} | "
          f"utilidad neta {r['neta']:,.0f} UF ({r['margen']:.1%})")
    print("  Caja: "+" ".join(f"{v:>8,.0f}" for v in r['caja'][:9]))
    print("  FC  : "+" ".join(f"{v:>8,.0f}" for v in r['fc'][:9]))
    a=0;ac=[]
    for v in r['fc'][:9]:
        a+=v;ac.append(a)
    print("  FCac: "+" ".join(f"{v:>8,.0f}" for v in ac))

print("\n\nCAPITAL MÁXIMO con estructura optimizada, por escenario")
for nom,kw in [("Conservador",dict(ritmo=10,urb_tot=185_000,inicio=3,precios=(3.3,3.3,3.4,3.5,3.6,3.7,3.8,3.8,3.8,3.8),gc=0.055,admin=3_000,H=15)),
               ("Base",dict()),
               ("Optimista",dict(ritmo=21,urb_tot=135_000,inicio=1,precios=(3.5,4.0,4.0,4.2,4.3,4.4),gc=0.040,H=10))]:
    r=run(**kw)
    print(f"  {nom:<12} capital máx {r['peak']:>8,.0f} UF | TIR {r['tir']*100:5.1f}% | VAN12 {r['van']:>8,.0f} | "
          f"neta {r['neta']:>8,.0f} UF | fin ventas año {r['ult']}")

print("\n\nPRECIO MÁXIMO DEL TERRENO con estructura optimizada (TIR objetivo)")
for nom,kw in [("Conservador",dict(ritmo=10,urb_tot=185_000,inicio=3,precios=(3.3,3.3,3.4,3.5,3.6,3.7,3.8,3.8,3.8,3.8),gc=0.055,admin=3_000,H=15)),
               ("Base",dict()),("Optimista",dict(ritmo=21,urb_tot=135_000,inicio=1,precios=(3.5,4.0,4.0,4.2,4.3,4.4),gc=0.040,H=10))]:
    line=[]
    for obj in (0.15,0.18,0.22):
        lo,hi=1_000.0,400_000.0
        for _ in range(60):
            mid=(lo+hi)/2
            r=run(precio_terreno=mid,pie=mid*0.084,**kw)
            if npv(r['fc'],obj)>0: lo=mid
            else: hi=mid
        line.append(f"{obj:.0%}: {lo:>9,.0f}")
    print(f"  {nom:<12} " + " | ".join(line))
