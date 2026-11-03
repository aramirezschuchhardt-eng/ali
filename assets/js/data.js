/*
 * CONTENIDO ADMINISTRABLE – AVANCE INMOBILIARIO
 * Este archivo se genera/edita desde /admin.html (botón "Descargar data.js").
 * Los proyectos incluidos son EJEMPLOS REFERENCIALES: reemplácelos por los proyectos reales vigentes.
 */
window.AVANCE_DATA = {
  "actualizado": "2026-11-03",
  "beneficios": [
    {
      "id": "tasa",
      "icono": "percent",
      "titulo": "Tasa hipotecaria subsidiada",
      "resumen": "Buscamos y comparamos las mejores condiciones de financiamiento disponibles para tu perfil.",
      "detalle": "Cotizamos con distintos bancos y mutuarias, y revisamos si tu compra califica para programas de subsidio a la tasa vigentes.",
      "requisitos": "Sujeto a evaluación crediticia de cada institución, al tipo y valor de la vivienda y a los cupos y condiciones vigentes del programa.",
      "activo": true
    },
    {
      "id": "fogaes",
      "icono": "shield",
      "titulo": "FOGAES",
      "resumen": "Evaluamos alternativas de garantía estatal que pueden facilitar el acceso al crédito con menor pie.",
      "detalle": "Analizamos si tu operación puede acogerse al Fondo de Garantías Especiales y qué bancos lo están operando.",
      "requisitos": "Aplica según requisitos del programa, tope de valor de la vivienda, disponibilidad de cupos y aprobación de la entidad financiera.",
      "activo": true
    },
    {
      "id": "bonopie",
      "icono": "gift",
      "titulo": "Bono pie",
      "resumen": "Te mostramos proyectos con bono pie, descuentos y facilidades para pagar el pie en cuotas.",
      "detalle": "Seleccionamos inmobiliarias que ofrecen bono pie, descuentos por pronta entrega y pie en cuotas sin interés.",
      "requisitos": "Bonos y descuentos son definidos por cada inmobiliaria, tienen stock limitado y pueden cambiar sin previo aviso.",
      "activo": true
    },
    {
      "id": "iva",
      "icono": "receipt",
      "titulo": "Devolución de IVA",
      "resumen": "Evaluamos oportunidades de recuperación de IVA cuando corresponda legal y tributariamente.",
      "detalle": "Revisamos tu situación con asesoría tributaria para determinar si existe una alternativa legal de recuperación de IVA.",
      "requisitos": "Depende de la normativa tributaria vigente y de tu situación particular. Requiere evaluación de un profesional tributario. No es aplicable a todos los casos.",
      "activo": true
    }
  ],
  "perfiles": [
    {
      "titulo": "Primera inversión",
      "texto": "Te guiamos paso a paso para dar tu primer paso inmobiliario con una decisión informada y a tu medida.",
      "tag": "Comenzar"
    },
    {
      "titulo": "Inversión con bajo pie",
      "texto": "Buscamos proyectos con bono pie, pie en cuotas y alternativas de garantía para reducir el capital inicial.",
      "tag": "Bajo pie"
    },
    {
      "titulo": "Generación de flujo",
      "texto": "Priorizamos ubicación, arriendo estimado y tasa para buscar el mejor equilibrio entre dividendo y renta.",
      "tag": "Flujo"
    },
    {
      "titulo": "Expansión patrimonial",
      "texto": "Diseñamos una estrategia de varias unidades en el tiempo para diversificar y hacer crecer tu patrimonio.",
      "tag": "Patrimonio"
    }
  ],
  "proyectos": [
    {
      "id": "p1",
      "nombre": "Edificio Parque Central",
      "inmobiliaria": "Inmobiliaria de ejemplo",
      "comuna": "Ñuñoa",
      "direccion": "A pasos de Metro Irarrázaval",
      "precioDesde": 3150,
      "dormitorios": [1, 2],
      "tipologias": "Studio, 1D1B, 2D2B · 28 a 58 m²",
      "entrega": "Inmediata",
      "bonoPie": 10,
      "descuento": 5,
      "arriendoEstimado": 420000,
      "promocion": "Pie en 36 cuotas",
      "beneficios": ["bonopie", "tasa"],
      "imagen": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=70",
      "descripcion": "Proyecto residencial con áreas comunes completas, cowork, gimnasio y quincho. Alta demanda de arriendo por cercanía a Metro y servicios.",
      "destacado": true,
      "activo": true
    },
    {
      "id": "p2",
      "nombre": "Mirador San Miguel",
      "inmobiliaria": "Inmobiliaria de ejemplo",
      "comuna": "San Miguel",
      "direccion": "Gran Avenida, cerca de Metro Línea 2",
      "precioDesde": 2690,
      "dormitorios": [1, 2],
      "tipologias": "1D1B, 2D1B, 2D2B · 32 a 55 m²",
      "entrega": "2027",
      "bonoPie": 15,
      "descuento": 0,
      "arriendoEstimado": 380000,
      "promocion": "Bono pie 15%",
      "beneficios": ["bonopie", "fogaes"],
      "imagen": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=70",
      "descripcion": "Departamentos eficientes en comuna con alta conectividad. Ideal para inversión con bajo pie y entrega en verde.",
      "destacado": true,
      "activo": true
    },
    {
      "id": "p3",
      "nombre": "Distrito Estación",
      "inmobiliaria": "Inmobiliaria de ejemplo",
      "comuna": "Estación Central",
      "direccion": "Sector universidades y Metro Línea 1",
      "precioDesde": 2350,
      "dormitorios": [1],
      "tipologias": "Studio, 1D1B · 24 a 36 m²",
      "entrega": "Inmediata",
      "bonoPie": 10,
      "descuento": 8,
      "arriendoEstimado": 340000,
      "promocion": "Descuento 8% últimas unidades",
      "beneficios": ["bonopie", "iva"],
      "imagen": "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=70",
      "descripcion": "Unidades compactas pensadas para arriendo a estudiantes y profesionales jóvenes. Entrega inmediata para arrendar desde el primer mes.",
      "destacado": false,
      "activo": true
    },
    {
      "id": "p4",
      "nombre": "Alto Independencia",
      "inmobiliaria": "Inmobiliaria de ejemplo",
      "comuna": "Independencia",
      "direccion": "Av. Independencia, cerca de clínicas y Metro Línea 3",
      "precioDesde": 2480,
      "dormitorios": [1, 2],
      "tipologias": "1D1B, 2D2B · 30 a 52 m²",
      "entrega": "2027",
      "bonoPie": 12,
      "descuento": 3,
      "arriendoEstimado": 360000,
      "promocion": "Pie en 48 cuotas",
      "beneficios": ["bonopie", "fogaes", "tasa"],
      "imagen": "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=70",
      "descripcion": "Polo de salud y educación con demanda sostenida de arriendo. Terminaciones modernas y amplias áreas comunes.",
      "destacado": false,
      "activo": true
    },
    {
      "id": "p5",
      "nombre": "Barrio Providencia Living",
      "inmobiliaria": "Inmobiliaria de ejemplo",
      "comuna": "Providencia",
      "direccion": "Sector Manuel Montt",
      "precioDesde": 4300,
      "dormitorios": [1, 2, 3],
      "tipologias": "1D1B, 2D2B, 3D2B · 38 a 85 m²",
      "entrega": "2028",
      "bonoPie": 10,
      "descuento": 0,
      "arriendoEstimado": 560000,
      "promocion": "Precio de preventa",
      "beneficios": ["bonopie", "tasa"],
      "imagen": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=70",
      "descripcion": "Ubicación consolidada con potencial de plusvalía. Alternativa para estrategias de expansión patrimonial.",
      "destacado": true,
      "activo": true
    },
    {
      "id": "p6",
      "nombre": "Vista Macul",
      "inmobiliaria": "Inmobiliaria de ejemplo",
      "comuna": "Macul",
      "direccion": "Cerca de Metro Línea 4 y universidades",
      "precioDesde": 2790,
      "dormitorios": [2, 3],
      "tipologias": "2D2B, 3D2B · 48 a 68 m²",
      "entrega": "2027",
      "bonoPie": 15,
      "descuento": 0,
      "arriendoEstimado": 450000,
      "promocion": "Bono pie 15% + estacionamiento con descuento",
      "beneficios": ["bonopie", "fogaes"],
      "imagen": "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=70",
      "descripcion": "Departamentos familiares de 2 y 3 dormitorios en barrio residencial con buena conectividad.",
      "destacado": false,
      "activo": true
    },
    {
      "id": "p7",
      "nombre": "Santiago Centro Urbano",
      "inmobiliaria": "Inmobiliaria de ejemplo",
      "comuna": "Santiago",
      "direccion": "Barrio República",
      "precioDesde": 2250,
      "dormitorios": [1],
      "tipologias": "Studio, 1D1B · 23 a 34 m²",
      "entrega": "Inmediata",
      "bonoPie": 5,
      "descuento": 10,
      "arriendoEstimado": 330000,
      "promocion": "Descuento 10% contado",
      "beneficios": ["iva", "bonopie"],
      "imagen": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=70",
      "descripcion": "Alta rotación de arriendo en el corazón de Santiago. Unidades compactas con buen ratio precio/arriendo.",
      "destacado": false,
      "activo": true
    },
    {
      "id": "p8",
      "nombre": "Parque La Florida",
      "inmobiliaria": "Inmobiliaria de ejemplo",
      "comuna": "La Florida",
      "direccion": "Cerca de Metro Línea 5 y mall",
      "precioDesde": 2590,
      "dormitorios": [2, 3],
      "tipologias": "2D2B, 3D2B · 50 a 72 m²",
      "entrega": "2028",
      "bonoPie": 20,
      "descuento": 0,
      "arriendoEstimado": 430000,
      "promocion": "Bono pie hasta 20%",
      "beneficios": ["bonopie", "fogaes", "tasa"],
      "imagen": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=70",
      "descripcion": "Proyecto en verde con uno de los bonos pie más altos del catálogo. Comuna con alta demanda familiar.",
      "destacado": false,
      "activo": true
    }
  ]
};
