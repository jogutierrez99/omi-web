# Ejemplos de peticiones para el equipo OMI

No es obligatorio nombrar agentes: `AGENTS.md` permite al agente principal seleccionar el flujo. Nombrarlos resulta útil cuando quieres controlar explícitamente el proceso.

## Ideas sin código

> Usa `frontend_ideation` para analizar la home actual de OMI. Propón tres direcciones claramente distintas para mejorar confianza y conversión. Compara ventajas, riesgos y complejidad. No modifiques archivos.

## Diseño detallado sin implementación

> Diseña una nueva sección de beneficios para la home de OMI. Ejecuta ideación y especificación UI. Reutiliza el sistema visual real del repositorio, define móvil/tablet/escritorio y termina con criterios de aceptación. No escribas código.

## Feature completa

> Quiero añadir [descripción]. Coordina el workflow mínimo completo. Inspecciona primero el repositorio, define criterios, implementa el cambio y no termines hasta que QA dé PASS. No cambies áreas ajenas.

## Requisitos ya definidos

> Implementa estos requisitos exactos: [lista]. Omite ideación. Usa `codex_prompt_engineer`, `frontend_developer` y `frontend_qa`. Conserva la arquitectura y ejecuta los checks reales del proyecto.

## Corrección de bug

> En móvil, [síntoma]. Haz que `frontend_qa` lo reproduzca primero, que `frontend_developer` aplique la corrección mínima y que QA vuelva a probar el flujo y posibles regresiones.

## Solo diagnóstico

> Investiga por qué [síntoma]. Quiero causa raíz, evidencia y opciones de solución, pero no modifiques archivos.

## Revisión de una rama o cambios locales

> Revisa el diff actual contra los criterios de la tarea. Prioriza errores funcionales, regresiones, responsive, accesibilidad y tests faltantes. No hagas cambios. Devuelve findings por severidad y un veredicto.

## Rediseño a partir de una imagen

> Usa esta captura como referencia visual, no como especificación literal. Identifica qué principios encajan con OMI, crea una dirección propia, especifica el diseño e impleméntalo sin copiar marca, textos ni assets de terceros. Valida responsive y accesibilidad.

## Revalidar tras una corrección

> Reejecuta QA para los defects `QA-002` y `QA-004`. Verifica también los criterios relacionados y confirma que no haya regresión en los viewports afectados. No edites código.

## Forzar una decisión antes de implementar

> Genera tres opciones para [sección]. Detente después de ideación y espera a que elija una; no continúes a diseño o código.

## Entrega compacta

> Realiza el cambio y al final dime solamente: resultado, archivos modificados, checks ejecutados, veredicto QA y warnings reales.

