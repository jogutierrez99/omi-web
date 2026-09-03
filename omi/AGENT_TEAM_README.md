# Equipo frontend de Codex para OMI

Este paquete configura un equipo especializado para trabajar en el frontend de OMI con Codex.

## Instalación

1. Descomprime `omi-codex-agent-team.zip`.
2. Copia **el contenido** de la carpeta descomprimida en la raíz del repositorio OMI.
3. La raíz debe quedar con `AGENTS.md`, `.codex/` y `docs/` al mismo nivel que `package.json`.
4. Cierra y vuelve a abrir la sesión de Codex para que vuelva a cargar las instrucciones y los agentes.

Si el proyecto ya tiene un `AGENTS.md` o `.codex/config.toml`, no lo sobrescribas a ciegas: integra las secciones de este paquete con la configuración existente.

## Qué contiene

```text
AGENTS.md
AGENT_TEAM_README.md
.codex/
  config.toml
  agents/
    frontend-ideation.toml
    ui-design-specification.toml
    codex-prompt-engineer.toml
    frontend-developer.toml
    frontend-qa.toml
    frontend-orchestrator.toml
docs/
  agents/
    01-frontend-ideation.md
    02-ui-design-specification.md
    03-codex-prompt-engineer.md
    04-frontend-developer.md
    05-frontend-qa.md
    06-frontend-orchestrator.md
    CONTRACTS.md
    PROJECT_CONTEXT.md
    PROMPT_EXAMPLES.md
    WORKFLOW.md
```

## Cómo funciona

`AGENTS.md` es la instrucción principal que Codex detecta automáticamente. El agente principal se comporta como orquestador y puede invocar los especialistas configurados en `.codex/agents/`.

Los documentos de `docs/agents/` explican en detalle los roles, límites, contratos y criterios de finalización. Los archivos TOML convierten esos diseños en agentes de proyecto invocables por Codex.

## Primeras pruebas

Prueba una petición conceptual:

> Analiza la home de OMI y usa `frontend_ideation` para proponer tres direcciones visuales. No modifiques código.

Prueba una implementación completa:

> Rediseña el hero de la home. Coordina ideación, especificación, implementación y QA. Conserva el diseño existente fuera del hero y no termines hasta que QA dé PASS.

Prueba un bug:

> El menú móvil se desborda a 375 px. Reprodúcelo con QA, aplica la corrección mínima y vuelve a validarlo.

Más ejemplos: `docs/agents/PROMPT_EXAMPLES.md`.

## Nota técnica

Los archivos Markdown son la documentación y las reglas del sistema. Los agentes personalizados de proyecto se registran mediante archivos TOML en `.codex/agents/`; por eso este paquete incluye ambos formatos.

