# Estado en Meta — qué quedó creado (todo EN PAUSA)

Cuenta: **BenestarAds** · ID `379252265976319` · Moneda **CLP**
Business: Negocio de Alison Ramirez Schuchhardt
Página: **Avance Inmobiliario** · ID `709473406083562`
Píxel: **DATOS DE AVANCE INMOBILIARIO** · ID `8571984936242054`

## ✅ Creado

| Objeto | Nombre | ID | Estado |
|---|---|---|---|
| Campaña | `CL_VENTAS_EVALUACION_LP_2026-09` | `120248711086490142` | **PAUSADA** |
| Ad set | `CL_ABIERTO_28-50_ADV+` | `120248711089760142` | **PAUSADA** |

**Configuración de la campaña:**
- Objetivo: Clientes potenciales (OUTCOME_LEADS)
- Presupuesto: **CBO $10.000 CLP/día**, puja Costo más bajo sin límite
- Sin categoría especial de anuncios

**Configuración del ad set:**
- Ubicación: **Chile** · Edad **28-50** (como sugerencia de Advantage+ Audience)
- Optimización: **Conversiones fuera del sitio → evento `Lead`** del píxel `8571984936242054`
- Destino: sitio web (la landing)
- Plataformas: Facebook, Instagram y Messenger (**Audience Network excluida**, como planificamos)
- Atribución: 7 días clic / 1 día visualización

**Enlaces directos:**
- Campaña: https://www.facebook.com/adsmanager/manage/campaigns/edit?act=379252265976319&selected_campaign_ids=120248711086490142
- Ad set: https://www.facebook.com/adsmanager/manage/adsets/edit?act=379252265976319&selected_adset_ids=120248711089760142

---

## ⛔ Bloqueado: públicos personalizados

Los 5 públicos de retargeting **no se pudieron crear** porque la cuenta no tiene aceptados los Términos de Públicos Personalizados.

**Solución (1 clic, 30 segundos):**
👉 https://www.facebook.com/customaudiences/app/tos/?act=379252265976319

Avísame cuando lo aceptes y los creo de inmediato:

| Público | Regla | Retención |
|---|---|---|
| `CL_LP_Visitantes_180d` | Todos los visitantes de la landing | 180 d |
| `CL_LP_SinLead_30d` | Visitaron pero no dejaron datos | 30 d |
| `CL_Checkout_Abandonado_14d` | `InitiateCheckout` sin `Purchase` | 14 d |
| `CL_Leads_180d` | Evento `Lead` | 180 d |
| `CL_Compradores_9990_180d` | Evento `Purchase` | 180 d |

> Nota: Meta permite máximo **180 días** de retención en públicos de sitio web (por eso compradores queda en 180 y no 365).

---

## ⚠️ Alerta importante: el píxel nunca ha registrado eventos

El píxel `DATOS DE AVANCE INMOBILIARIO` existe desde octubre de 2024 pero aparece **sin ningún evento registrado** (`last_fired_time` vacío).

Eso significa que, o no está instalado en la landing, o está instalado pero no dispara. **Si lanzas así, la campaña optimiza a ciegas y el CPL se dispara.**

**Antes de activar, obligatorio:**
1. Instalar el píxel en la landing (o revisar por qué no dispara).
2. Configurar los eventos `Lead`, `InitiateCheckout` y `Purchase` (valor 9990, moneda CLP).
3. Verificar con la extensión **Meta Pixel Helper** que los 3 disparan.
4. Verificar el dominio en Business Manager y configurar la priorización de 8 eventos.
5. Idealmente, activar también la **API de Conversiones**.

---

## 🔜 Lo que falta para poder activar (me lo pasas y lo dejo listo)

| Pendiente | Para qué |
|---|---|
| **URL de la landing** | Crear el anuncio y cargar los UTMs |
| **La imagen del creativo** | Subirla y armar las 4 piezas (1:1, 4:5, 9:16) |
| **Número de WhatsApp** | Botón flotante y campaña CTWA del test del día 10 |

Sin esos 3 datos no se puede crear el anuncio: la campaña y el ad set están listos, falta la pieza.

**Los intereses** (Stacks A-D de `01-publicos-e-intereses.md`) quedan documentados para cargarlos a mano en el Administrador de Anuncios: la API no permite buscar los IDs de intereses desde aquí y **nunca hay que inventarlos**. De todos modos, con $10.000/día el ad set abierto con Advantage+ (el que quedó creado) suele rendir mejor que uno con intereses cargados — los intereses son para el segundo ad set, cuando escales.
