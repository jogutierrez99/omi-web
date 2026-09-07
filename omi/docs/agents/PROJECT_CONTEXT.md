# Contexto de proyecto — OMI

Este archivo es contexto auxiliar y vivo. El repositorio prevalece para decisiones técnicas y `docs/agents/OMI_BUSINESS_CONTEXT.md` prevalece para hechos corporativos confirmados.

## Identidad del proyecto

| Campo | Valor | Estado |
|---|---|---|
| Empresa | Embotelladora OMI C.A. | confirmado |
| Marca | OMI | confirmado |
| Sector | Embotellado y comercialización de agua mineral | confirmado |
| Inicio de actividad | Finales de 2017 | confirmado por la empresa |
| Ubicación general | Maracay, estado Aragua, Venezuela | confirmado |
| Dirección de referencia | Intercomunal Turmero-Maracay, sector La Providencia | confirmado; falta dirección postal exacta |
| Tipo de trabajo | Web, frontend y producción visual | confirmado |
| Framework esperado | Next.js | confirmado por el contexto inicial; verificar versión |
| Lenguaje esperado | TypeScript | por verificar en el repositorio |
| Sistema de estilos | Detectar en el repositorio | por verificar |
| Gestor de paquetes | Detectar mediante lockfile | por verificar |
| Arquitectura de rutas | Detectar App Router o Pages Router | por verificar |

## Objetivos de la web

- Presentar a OMI como una embotelladora profesional, cercana y confiable.
- Explicar el origen en pozo profundo y las características declaradas del agua.
- Mostrar los formatos comerciales actuales y sus unidades por gavera.
- Facilitar ubicación, contacto, redes y futuras solicitudes de franquicia.
- Dar protagonismo visual al producto sin sacrificar claridad, rendimiento o accesibilidad.
- Diferenciar hechos confirmados de claims pendientes de respaldo.

## Arquitectura de contenido aprobada

1. Inicio / hero.
2. Quiénes somos.
3. Nuestra agua.
4. Productos.
5. Calidad y reconocimiento.
6. Franquicias.
7. Dónde estamos, con mapa.
8. Contacto y redes sociales.

La propuesta visual anterior puede conservar bloques de uso cotidiano, recarga, sostenibilidad y CTA siempre que no contradigan esta información ni inventen servicios.

## Principios

- Profesionalidad, claridad, confianza y frescura.
- Experiencia móvil con la misma prioridad que escritorio.
- Reutilizar branding y componentes existentes.
- Rendimiento, accesibilidad y mantenibilidad forman parte de la aceptación.
- No inventar datos, testimonios, reconocimientos, precios, beneficios sanitarios o funcionalidades.
- El copy público debe proceder de `docs/content/WEBSITE_COPY_ES.md`.

## Fuentes de verdad

### Decisiones técnicas

1. Petición actual del usuario.
2. `AGENTS.md` aplicable.
3. Código y configuración del repositorio.
4. Criterios aprobados del workflow.
5. Este documento.

### Negocio y contenido

1. Información corporativa confirmada por la empresa.
2. `docs/agents/OMI_BUSINESS_CONTEXT.md`.
3. Documentos oficiales, registros, análisis y certificados.
4. `docs/content/WEBSITE_COPY_ES.md`.
5. Materiales promocionales previos.

## Inventario técnico por completar

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

## Decisiones aprobadas

| Fecha | Decisión | Alcance |
|---|---|---|
| 2026-09-05 | Equipo Codex con especialistas frontend, visuales y QA | Todo el repositorio |
| 2026-09-05 | Etiquetas visuales transparentes y sello dorado en los formatos representados | Producción visual |
| 2026-09-06 | Catálogo actual: 330 cc, 1,5 L, 5 L y 18 L | Web, contenido e imágenes |
| 2026-09-06 | Estructura corporativa de ocho bloques principales | Arquitectura web |

## Riesgos conocidos

- El formato comercial pequeño confirmado es 330 cc. No usar capacidades anteriores como fuente de verdad.
- Los claims de composición, baja mineralización, bajo sodio y ausencia de cloración deben vincularse a análisis y permisos vigentes antes de presentarse como certificados.
- La recomendación sanitaria asociada al evento de café de 2024 necesita documentación y nombres oficiales.
- Faltan datos completos de contacto, mapa y redes.

## Pendientes

- Teléfono y WhatsApp oficiales.
- Correo confirmado para la web.
- Dominio oficial.
- Dirección postal exacta o coordenadas/enlace de Google Maps.
- Usuarios y enlaces de redes sociales.
- Horario de atención.
- Nombre y evidencia del reconocimiento de 2024.
- Registro sanitario, análisis físico-químico y soporte de claims públicos.
- Condiciones y formulario deseado para futuras franquicias.
