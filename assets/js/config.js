/*
 * CONFIGURACIÓN GENERAL – AVANCE INMOBILIARIO
 * Edite estos valores para conectar WhatsApp, CRM y agenda comercial.
 * No requiere conocimientos de programación: sólo reemplace el texto entre comillas.
 */
window.AVANCE_CONFIG = {
  // Número de WhatsApp en formato internacional, sin "+" ni espacios (ej: 56912345678)
  whatsapp: "56900000000",
  whatsappMensaje: "Hola Avance Inmobiliario, quiero asesoría para invertir.",

  // Endpoint del CRM / automatización para recibir los leads del formulario (POST JSON).
  // Ejemplos: webhook de Zapier, Make, HubSpot Forms API, Pipedrive vía Make, n8n, etc.
  // Si se deja vacío, los leads se guardan localmente y se abre WhatsApp como respaldo.
  crmWebhook: "",

  // Enlace de agenda comercial (Calendly, HubSpot Meetings, Google Calendar Booking, etc.)
  agendaUrl: "https://calendly.com/",

  // Datos de contacto visibles
  email: "contacto@avanceinmobiliario.cl",
  telefono: "+56 9 0000 0000",
  direccion: "Santiago, Chile",
  instagram: "https://instagram.com/",
  linkedin: "https://linkedin.com/",

  // Valor UF referencial usado para conversiones a pesos (actualizar periódicamente)
  valorUF: 40000,

  // Contraseña simple del panel de administración (ver README: no es seguridad real)
  adminPassword: "avance2026"
};
