# Base de conocimiento — Colegio San Guillermo

Esta es la única fuente de verdad del bot de admisión. El bot **no debe inventar
ni deducir** información que no esté aquí.

> **Marcadores por completar**
> `[LINK DE AGENDAMIENTO]` — URL del formulario para agendar visita. Debe
> reemplazarse por el enlace real antes de poner el bot en producción.

---

## 1. Horarios de clases

### Prekínder y Kínder

- Jornada: **08:00 a 12:30 horas**.
- Existe **extensión horaria opcional hasta las 16:00 horas**.

### 1° Básico a 8° Básico

- Jornada habitual: **08:00 a 15:25 horas**.
- **Los martes** la salida es a las **13:10 horas**.

---

## 2. Horario de atención de Admisión

- **Todos los días, de 08:00 a 17:00 horas.**
- Se atiende directamente en el colegio, sin necesidad de agendar previamente.

---

## 3. Talleres extraprogramáticos

El colegio ofrece una amplia variedad de talleres extraprogramáticos que se
desarrollan **después de la jornada escolar**, con el objetivo de potenciar el
desarrollo deportivo, artístico, cultural y recreativo de los estudiantes.

Talleres disponibles:

- Fútbol
- Taekwondo
- Música
- Batucada
- Danza
- Patinaje

Durante el año pueden incorporarse otros talleres según la planificación
académica y la disponibilidad.

**Cómo responder:** cuando un apoderado consulta por talleres, el bot debe
explicar que se realizan **una vez finalizada la jornada de clases** y que la
oferta **puede variar según el nivel del estudiante y la programación anual**
del colegio.

---

## 4. Dirección

- **Silo 3014, comuna de Puente Alto.**

**Cómo responder:** si el apoderado pregunta cómo llegar o manifiesta interés en
conocer el colegio, el bot debe **invitarlo cordialmente a visitarlo**.

---

## 5. Información institucional

- El Colegio San Guillermo es **100% gratuito**: no tiene costo de matrícula ni
  mensualidad. Las familias no pagan por la educación de sus hijos.
- Imparte enseñanza **desde Prekínder hasta 8° Básico**.
- Cuenta con **Proyecto de Integración Escolar (PIE)** y un **equipo
  multidisciplinario de apoyo**.
- Promueve una **formación integral**, fortaleciendo tanto el aprendizaje
  académico como el desarrollo personal y valórico de sus estudiantes.
- Busca mantener una **comunicación cercana y permanente con las familias**.

---

## 6. Admisión y matrícula

Para iniciar el proceso de matrícula, el apoderado debe presentar **únicamente**:

1. **Certificado de nacimiento** del estudiante.
2. **Certificado de notas**.

Con esos documentos puede:

- **Agendar una visita** mediante el enlace `[LINK DE AGENDAMIENTO]`, **o**
- **Acercarse directamente al colegio** en horario de atención (todos los días,
  08:00 a 17:00 horas) si le resulta más conveniente.

**Hay cupos disponibles en todos los niveles**, de Prekínder a 8° Básico.

**El proceso no tiene costo:** el colegio es 100% gratuito, por lo que no se
cobra matrícula ni mensualidad. Es un dato que conviene mencionar, porque suele
ser la principal preocupación del apoderado.

**Importante:** no se deben mencionar otros requisitos, cupos ni
plazos, porque no están definidos en esta base. Ante ese tipo de consultas,
aplicar la regla de derivación (ver `system-prompt.md`).

---

## 7. Beneficios para las familias

### 7.1 Alimentación JUNAEB

- **Todos los estudiantes** del colegio reciben alimentación JUNAEB.
- Incluye **desayuno, colación y almuerzo**.
- Es un beneficio que conviene mencionar cuando se habla de matrícula o de la
  jornada, junto con la gratuidad.

### 7.2 Transporte escolar

- El colegio **cuenta con transporte gratuito**.
- **Depende del sector** donde vive la familia: no cubre todos los sectores.
- **Cómo responder:** confirmar que el transporte existe y es gratuito, pero
  **nunca asegurar** que llega a la dirección del apoderado. Preguntar en qué
  sector vive y derivar la confirmación al equipo de admisión.

### 7.3 Uniforme de preescolares — mención condicionada

- El colegio **regala el uniforme** a los estudiantes de preescolar.
- **Regla de uso:** este beneficio se menciona **únicamente cuando la consulta es
  por Prekínder**. No ofrecerlo ni mencionarlo en consultas por otros niveles, ni
  en el mensaje de bienvenida, ni en respuestas generales.
- Si el apoderado pregunta expresamente por el uniforme de otro nivel, no se
  afirma que sea gratuito: se deriva al equipo de admisión.

---

## 8. Fuera de alcance

Temas sobre los que el bot **no tiene información** y debe derivar al equipo de
admisión:

- Si el **transporte gratuito cubre un sector determinado**. El beneficio existe,
  pero la cobertura la confirma el equipo de admisión.
- **Uniforme de 1° a 8° Básico**, útiles escolares y listas de materiales. El
  uniforme regalado aplica a preescolares (ver 7.3).
- Si la **extensión horaria** de Prekínder y Kínder tiene algún costo o requisito
  adicional. La gratuidad declarada es de la enseñanza; sobre la extensión no hay
  información, así que no se debe afirmar que es gratuita.
- Fechas y plazos del proceso de admisión.
- Situaciones particulares de un estudiante ya matriculado.
- Detalles del PIE más allá de su existencia y del equipo multidisciplinario.
- Horarios, días o costos específicos de cada taller extraprogramático.
