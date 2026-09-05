# Equipo de imágenes OMI

Este módulo añade a Codex un pipeline especializado para diseñar, generar, editar y validar imágenes de OMI.

## Principio de precisión

La IA generativa crea la escena, iluminación, materiales y composición. Los elementos que deben ser exactos —logo, nombre, eslogan, capacidad, sello o texto legal— se aplican después desde el arte original mediante `brand_compositor`.

Esta separación evita el error más común de la generación de producto: una botella visualmente atractiva con letras deformadas o packaging inventado.

## Agentes

1. `image_reference_analyst`: convierte las referencias en hechos e invariantes.
2. `product_image_specification`: define producto, cámara, luz, materiales y archivo.
3. `image_art_director`: diseña y selecciona la dirección creativa.
4. `image_prompt_engineer`: produce instrucciones de generación o edición controladas.
5. `image_producer`: ejecuta la herramienta de imagen.
6. `brand_compositor`: aplica los activos exactos de OMI.
7. `image_visual_qa`: compara y acepta o rechaza.
8. `image_orchestrator`: coordina el flujo y los reintentos.

## Uso recomendado

Habla con Codex desde la raíz del proyecto y nombra el orquestador:

> Usa `image_orchestrator` y el equipo visual para crear un hero horizontal con los cuatro formatos OMI. Utiliza las referencias del proyecto como fuente de verdad, aplica la etiqueta exacta después de generar la escena y no termines sin QA PASS.

Para una tarea simple no es obligatorio ejecutar todo el pipeline. El orquestador debe seleccionar solo las fases necesarias.

## Límites reales

- Un render aprobado para web no equivale a un arte final de imprenta.
- La impresión necesita troquel, dimensiones físicas, sangrado, perfil de color y requisitos del proveedor.
- Si falta una fotografía frontal nítida de un envase, su geometría será aproximada.
- Si falta el arte vectorial completo de una etiqueta, el texto pequeño no puede certificarse como exacto.
