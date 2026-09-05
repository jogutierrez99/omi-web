# Catálogo y contratos de responsabilidad

| Agente | Entrada principal | Salida principal | No hace |
|---|---|---|---|
| `image_reference_analyst` | Petición y referencias | Matriz de hechos, prioridades e invariantes | Diseñar o editar |
| `product_image_specification` | Hechos y destino | Ficha técnica reproducible | Generar o decidir branding |
| `image_art_director` | Brief y ficha | Dirección artística aprobable | Alterar producto o producir |
| `image_prompt_engineer` | Ficha y dirección | Prompt, referencias, negativos y QA | Ejecutar la imagen |
| `image_producer` | Prompt aprobado | Master generativo y reporte | Certificar marca exacta |
| `brand_compositor` | Base y activos originales | Master con branding exacto | Rediseñar la escena |
| `image_visual_qa` | Resultado y criterios | PASS/REJECT con evidencia | Corregir el archivo |
| `image_orchestrator` | Petición completa | Workflow, estado y entrega | Trabajo especialista |

## Niveles de autonomía

| Agente | Nivel | Motivo |
|---|---:|---|
| Referencias | 2 | Analiza y recomienda; no escribe |
| Especificación | 2 | Define reglas; no produce |
| Dirección artística | 2 | Propone; respeta aprobación y producto |
| Prompt visual | 3 | Decide la forma técnica de la operación |
| Productor | 4 | Puede crear artefactos dentro del alcance |
| Compositor | 4 | Puede producir masters y derivados sin tocar originales |
| QA visual | 3 | Ejecuta validación independiente |
| Orquestador | 5 | Coordina especialistas, no altera artefactos |

## Puertas de calidad

1. No se produce sin invariantes y fuentes de verdad.
2. No se compone marca sin activo original.
3. No se entrega imagen final sin QA.
4. Un defecto de logo, texto, capacidad, alfa o formato siempre bloquea la entrega.
5. Máximo tres iteraciones automáticas; después se informa del bloqueo real.
