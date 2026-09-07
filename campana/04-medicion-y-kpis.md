# Medición y KPIs — sin esto la campaña es a ciegas

## 1. Píxel de Meta + API de Conversiones (CAPI)

**Obligatorio antes de lanzar.** Con presupuesto chico, la señal limpia es lo que hace que Meta encuentre a los compradores.

| Evento | Cuándo dispara | Valor | Uso |
|---|---|---|---|
| `PageView` | Toda visita a la landing | — | Público P1 |
| `ViewContent` | Llega al bloque de precio / 50% de scroll | — | Señal de interés |
| `Lead` | Envía el formulario **o** abre WhatsApp | — | **Evento de optimización semanas 1-4** |
| `InitiateCheckout` | Hace clic en "Pagar $9.990" | 9990 CLP | Público P3 (abandono) |
| `Purchase` | Pago confirmado | **9990 CLP** | La métrica que importa |
| `Schedule` | Agenda la sesión | — | Calidad de cliente |

**Requisitos:**
- Instala **API de Conversiones** además del píxel (server-side). En Chile, con iOS + bloqueadores, el píxel solo pierde 20-35% de las conversiones. Menos datos = peor optimización = CPL más caro.
- **Verifica el dominio** en Business Manager y configura la **priorización de 8 eventos** (Aggregated Event Measurement): 1) Purchase 2) InitiateCheckout 3) Lead 4) ViewContent 5) PageView.
- Prueba todo con el **Meta Pixel Helper** antes de gastar el primer peso.

## 2. UTMs — pega esto en el campo "Parámetros de URL" del anuncio
```
utm_source=facebook&utm_medium=paid&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}&utm_id={{ad.id}}
```
Así sabes exactamente **qué anuncio trajo a quién paga**, no solo qué anuncio trajo clics.

## 3. Nomenclatura (úsala desde el día 1, después es imposible ordenar)
```
Campaña:  CL_VENTAS_EVALUACION_LP_2026-09
Ad set:   CL_ABIERTO_28-50_ADV+   |   CL_INTERESES_INMOB_28-50   |   CL_RTG_LP30D
Anuncio:  IMG_1x1_ANG1-CERTEZA_v1 | VID_9x16_ANG4-INVERSION_v2
```
Formato: `[FORMATO]_[RATIO]_[ÁNGULO]_[versión]`

## 4. Tablero semanal (llénalo cada lunes)

| Semana | Gasto | Impr. | CTR | CPC | Visitas LP | Leads | CPL | Pagadas | **CPE** | Ingreso | Ángulo ganador |
|---|---|---|---|---|---|---|---|---|---|---|---|
| S1 | | | | | | | | | | | |
| S2 | | | | | | | | | | | |

## 5. Diagnóstico rápido: dónde está el problema

| Síntoma | Causa probable | Qué hacer |
|---|---|---|
| CPM alto (>$6.000) | Público muy chico o creativo con bajo engagement | Abre el público, cambia el creativo |
| CTR bajo (<0,8%) | **El creativo no engancha** | Nuevo gancho en los primeros 3 s. Es el 90% de los casos |
| CTR bien, pocas visitas | Landing lenta | Optimiza velocidad, revisa en móvil |
| Muchas visitas, pocos leads (<5%) | La landing no cumple lo que promete el anuncio | Alinea titular y precio, acorta el formulario |
| Muchos leads, pocos pagan (<15%) | Lead sin calificar o respuesta lenta | Califica en el anuncio, responde en <5 min |
| Pagan pero no agendan | Falta claridad en el proceso post-pago | Email + WhatsApp automático inmediato con los pasos |
| Todo bien pero CPE alto | Ticket muy bajo para el CAC | Sube el precio o vende un paquete (evaluación + asesoría) |

## 6. Frecuencia de revisión (con $10.000/día)
- **Diario (5 min):** solo verificar que no haya anuncios rechazados y que el gasto corra.
- **Cada 3 días:** revisar CPL y rotar creativos fatigados.
- **Semanal:** decisiones de presupuesto, apagar/encender ad sets, tablero.
- **Nunca:** editar todos los días. Cada cambio reinicia el aprendizaje y con este presupuesto no puedes pagar dos reinicios.
