# Contexto de proyecto — OMI

Este archivo es contexto auxiliar y vivo. El repositorio siempre prevalece. Los agentes deben verificar los campos marcados como `por verificar` antes de basar una decisión en ellos.

## Identidad

| Campo | Valor | Estado |
|---|---|---|
| Proyecto | OMI | confirmado |
| Tipo de trabajo | Web / frontend | confirmado |
| Framework esperado | Next.js | confirmado por el contexto inicial; verificar versión |
| Lenguaje esperado | TypeScript | por verificar en el repositorio |
| Sistema de estilos | Detectar en el repositorio | por verificar |
| Gestor de paquetes | Detectar mediante lockfile | por verificar |
| Arquitectura de rutas | Detectar App Router o Pages Router | por verificar |

## Principios iniciales

- La web debe transmitir profesionalidad, claridad y confianza.
- La experiencia móvil tiene la misma prioridad que escritorio.
- Se deben reutilizar el branding y los componentes existentes antes de crear un sistema paralelo.
- El rendimiento, la accesibilidad y la mantenibilidad forman parte de la aceptación.
- No se deben inventar datos comerciales, testimonios, precios o funcionalidades.

## Fuentes de verdad

Orden para decisiones técnicas:

1. Petición actual del usuario.
2. `AGENTS.md` aplicable.
3. Código y configuración del repositorio.
4. Criterios aprobados del workflow actual.
5. Este documento.

## Inventario por completar automáticamente durante tareas

```yaml
framework_version: unknown
package_manager: unknown
router: unknown
source_root: unknown
styling: unknown
ui_library: unknown
icons: unknown
fonts: unknown
testing:
  unit: unknown
  e2e: unknown
scripts:
  lint: unknown
  typecheck: unknown
  test: unknown
  build: unknown
key_routes: []
shared_components: []
design_tokens: []
known_constraints: []
```

Los agentes pueden informar estos datos en sus outputs. No deben reescribir este archivo salvo que el usuario solicite mantener el contexto de proyecto actualizado.

## Decisiones aprobadas

Añadir aquí únicamente decisiones confirmadas por el usuario o por el repositorio, con fecha y evidencia.

| Fecha | Decisión | Evidencia | Alcance |
|---|---|---|---|
| — | Sin decisiones registradas todavía | — | — |

## Riesgos conocidos

No registrados todavía. QA y planificación deben comunicar cualquier riesgo descubierto sin convertirlo automáticamente en deuda aceptada.

## Pendientes de producto

- Confirmar propuesta de valor y público principal de OMI cuando una decisión de producto lo requiera.
- Confirmar identidad visual definitiva si no está codificada en el repositorio.

