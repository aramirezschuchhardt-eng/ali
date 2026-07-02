# Paso a paso: crear las campañas de Terranova en Meta Ads Manager
### Avance Inmobiliario — Edificio Terranova, La Florida

---

## 0. Antes de empezar (una sola vez)

1. Entra a **business.facebook.com** (o abre la app "Administrador de Anuncios").
2. Verifica que tengas:
   - La **Página de Facebook** de Avance Inmobiliario creada y administrada por ti.
   - Una **cuenta de Instagram** vinculada a esa página (Configuración de la Página → Instagram → Conectar cuenta).
   - Un **método de pago** cargado en la cuenta publicitaria.
3. Instala el **Meta Pixel** en tu landing:
   - Administrador de Eventos → Conectar fuente de datos → Web → Meta Pixel → te da un código.
   - Pega ese código antes de `</head>` en tu `landing.html`.
   - Sin esto no vas a poder optimizar ni hacer retargeting.

---

## 1. Campaña 1 — Awareness / Inversión

1. Administrador de Anuncios → **Crear**.
2. Objetivo: **Interacción** o **Reproducciones de video** (si vas a subir un reel del edificio).
3. Nombre de campaña: `TERRANOVA | Awareness Inversión`.
4. Presupuesto: a nivel de campaña, o CBO si prefieres que Meta reparta solo.
5. **Conjunto de anuncios:**
   - Ubicación: Región Metropolitana, Chile.
   - Edad: 35–55.
   - Intereses: "Bienes raíces", "Inversión inmobiliaria", "Arriendo de propiedades".
   - Presupuesto diario: mínimo CLP $10.000–15.000.
   - Ubicaciones: Automáticas (Feed + Reels + Stories).
6. **Anuncio A:** sube el reel/video del edificio.
   - Texto principal: *"Compra en Terranova (La Florida) y arrienda garantizado por 2 años sobre el precio de mercado..."*
   - Botón: "Más información". Link: tu landing.
7. **Anuncio B:** carrusel con fotos (fachada, gimnasio, cocina).
   - Texto: *"Múdate este mes, no en 2 años..."*
   - Botón: "Cotizar ahora".
8. Guarda como **borrador / pausado** hasta revisar.

---

## 2. Campaña 2 — Consideración por Tipología

1. Crear campaña. Objetivo: **Tráfico**.
2. Nombre: `TERRANOVA | Consideración Tipología`.
3. Crea **un conjunto de anuncios por tipología** (así puedes pausar/subir presupuesto por separado):
   - **Ad Set Estudio/1D1B:** edad 25-35, comunas La Florida, Puente Alto, Macul.
   - **Ad Set 2D1B/2D2B:** edad 30-50, mismas comunas + La Reina, Ñuñoa.
   - **Ad Set 2D2B Arriendo Asegurado:** edad 35-55, interés en inversión.
4. En cada ad set, el anuncio es un carrusel con el precio "Desde UF X" de esa tipología.
5. Todos los links van al landing, con **parámetro UTM distinto por tipología**, ej:
   `tulanding.com/?utm_source=meta&utm_campaign=tipologia&utm_content=estudio`
   (esto te va a servir para saber qué tipología genera más leads).

---

## 3. Campaña 3 — Conversión (Leads / WhatsApp)

1. Crear campaña. Objetivo: **Clientes potenciales** (Lead Ads) o **Mensajes** (WhatsApp Click-to-Chat).
2. Nombre: `TERRANOVA | Conversión`.
3. **Ad Set Retargeting 7 días:** Audiencia personalizada → "Visitantes del sitio web, últimos 7 días" (requiere el Pixel activo desde antes).
4. **Ad Set Retargeting 30 días + Lookalike:** crea una audiencia similar (1%) basada en tu lista de clientes/leads si tienes un CRM o base de contactos que puedas subir.
5. **Ad Set WhatsApp Click-to-Chat:** en el anuncio, botón de destino = "Enviar mensaje de WhatsApp", conecta el número +56 9 3038 6399.
   - Guion de apertura: *"Hola, vi el anuncio de Terranova en La Florida y quiero más información..."*
6. Anuncio de urgencia: *"Quedan pocas unidades disponibles"* con botón "Ver disponibilidad".

---

## 4. Campaña 4 — Retargeting Always-on

1. Crear campaña. Objetivo: **Tráfico** o **Conversiones** (si ya tienes el evento de "lead" configurado en el Pixel).
2. Nombre: `TERRANOVA | Retargeting Always-on`.
3. Ad Set: audiencia = visitantes del landing que **no completaron el formulario** (excluye a quienes ya convirtieron creando un evento personalizado en el Pixel para el envío del formulario).
4. Anuncio: *"¿Seguimos viendo tu depto ideal en Terranova?"* con botón "Continuar cotización".
5. Este ad set queda corriendo de forma permanente mientras haya stock, con presupuesto bajo (es tu red de seguridad).

---

## 5. Checklist antes de activar

- [ ] Todos los anuncios llevan el disclaimer: *"Venta a cargo de Avance Inmobiliario, broker autorizado"*.
- [ ] Revisa que el link de cada anuncio abra el landing correctamente desde el celular.
- [ ] Activa notificaciones para responder WhatsApp/mensajes en menos de 5 minutos.
- [ ] Empieza con **presupuestos bajos** (mínimos) las primeras 48-72h, mira el CPL, y luego sube presupuesto a lo que funcione.
