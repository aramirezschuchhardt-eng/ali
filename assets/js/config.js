/*
 * CONFIGURACIÓN GENERAL – AVANCE INMOBILIARIO
 * Edite estos valores para conectar WhatsApp, CRM y agenda comercial.
 * No requiere conocimientos de programación: sólo reemplace el texto entre comillas.
 */
window.AVANCE_CONFIG = {
  // Número de WhatsApp en formato internacional, sin "+" ni espacios (ej: 56912345678)
  whatsapp: "56930386399",
  whatsappMensaje: "Hola Avance Inmobiliario, quiero asesoría para invertir.",

  // Endpoint del CRM / automatización para recibir los leads del formulario (POST JSON).
  // Ejemplos: webhook de Zapier, Make, HubSpot Forms API, Pipedrive vía Make, n8n, etc.
  // Si se deja vacío, los leads se guardan localmente y se abre WhatsApp como respaldo.
  crmWebhook: "",

  // Enlace de agenda comercial (Calendly, HubSpot Meetings, Google Calendar Booking, etc.)
  // Si se deja vacío, el botón "Agendar reunión" abre WhatsApp pidiendo agendar.
  agendaUrl: "",

  // Datos de contacto visibles
  email: "ventas@avanceinmobiliario.cl",
  telefono: "+56 9 3038 6399",
  direccion: "Cerro El Plomo 5630, piso 9, Las Condes, Santiago",
  // Redes sociales (dejar vacío "" para ocultar una red)
  instagram: "https://www.instagram.com/avanceinmobiliario.cl/",
  facebook: "https://www.facebook.com/avanceinmobiliario.cl",
  linkedin: "",

  // Valor UF referencial usado para conversiones a pesos (actualizar periódicamente)
  valorUF: 40000,

  // Contraseña simple del panel de administración (ver README: no es seguridad real)
  adminPassword: "avance2026"
};
