# Prompt: Create Section

TASK_TYPE: create_section
TASK: {{task}}
PAGE: {{page}}
SECTION_PURPOSE: {{purpose}}
CONTENT_SOURCE: {{content_source}}

## Activación y entrada

Usa este flujo cuando el usuario invoque `/create-section <tarea>` o pida crear o implementar una sección en lenguaje natural. La tarea recibida es el encargo que debes ejecutar, no una solicitud para generar otro prompt.

Los campos anteriores son una guía de entrada, no un formulario obligatorio. Completa los que falten leyendo la petición, la página afectada y el contexto del repositorio. No pidas al usuario datos que puedas obtener de esas fuentes. Si falta una decisión imprescindible, pregunta de forma concreta y avanza en el trabajo independiente de ella.

## Ejecución

1. Lee `AGENTS.md` y las reglas y el contexto canónicos aplicables. Inspecciona el estado de Git, la estructura real y los scripts disponibles antes de editar.
2. Identifica la página destino, el propósito, el contenido aprobado y los criterios de aceptación de la tarea. Conserva sus requisitos y referencias.
3. Revisa componentes, tokens y patrones existentes. Define la solución mínima coherente con la identidad de OMI, evitando duplicaciones y cambios ajenos al encargo.
4. Diseña e implementa la sección en el código e intégrala en la página correspondiente. Completa las interacciones solicitadas, la adaptación responsive y la accesibilidad aplicable. No termines tras proponer un diseño o un plan.
5. Usa contenido y assets aprobados. No inventes contenido corporativo, datos comerciales, enlaces ni métricas; sigue las reglas de contenido de `AGENTS.md` cuando falte información.
6. Ejecuta las comprobaciones relevantes disponibles y el QA exigido por `AGENTS.md`. Cuando cambie la UI, comprueba móvil, tablet y escritorio. Corrige los defectos dentro del alcance y vuelve a validar.
7. Entrega un resumen de lo implementado, archivos modificados, comprobaciones realmente ejecutadas, veredicto de QA y cualquier bloqueo o validación pendiente. No declares la tarea completada si quedan requisitos sin cubrir.

## Ejemplos de enrutamiento

- `/create-section Crea una sección de formatos en la página de inicio`: ejecuta este flujo con esa tarea.
- `Añade una sección sobre el origen del agua a la página de inicio`: activa este flujo sin exigir el comando explícito.
- `Dame ideas para una sección de formatos, sin implementarla`: respeta el alcance conceptual y el flujo de ideación de `AGENTS.md`.
