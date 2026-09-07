# OMI AI Development Kit

Paquete para convertir el repositorio de OMI en un entorno de desarrollo asistido por IA más consistente, auditable y reutilizable.

## Integración en este repositorio

Este kit está integrado como complemento del sistema existente. Los agentes Markdown de `docs/ai-kit/agents/` son guías conceptuales; los agentes ejecutables canónicos están en `.codex/agents/`. Las skills válidas y descubribles se encuentran en `.agents/skills/`. El `AGENTS.md` de la raíz y `docs/agents/` prevalecen ante cualquier conflicto.

## Qué incluye
- Orquestador y agentes especializados
- Skills reutilizables
- Contexto maestro de marca/producto/negocio
- Prompts parametrizados
- SOPs
- Definition of Done
- Registro de componentes y decisiones
- Evals
- Guías de testing, visual QA y rendimiento

## Uso

1. Lee el `AGENTS.md` de la raíz.
2. Consulta solo el contexto, prompt, SOP o evaluación de `docs/ai-kit/` que corresponda a la tarea.
3. Usa las skills de `.agents/skills/` cuando su descripción coincida con la petición.
4. Verifica cualquier dato genérico o pendiente contra el repositorio y el contexto canónico de `docs/agents/`.

## Flujo recomendado
Usuario -> Orchestrator -> Contexto -> Agente -> Skill -> SOP -> Implementación -> Tests -> Visual QA -> Critic -> Entrega

## Ejemplo de uso

`Lee AGENTS.md y audita la página solicitada. Usa únicamente el contexto y la skill del AI Development Kit que sean relevantes, sin modificar archivos hasta terminar el diagnóstico.`
