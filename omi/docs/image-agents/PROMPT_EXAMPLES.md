# Ejemplos para hablar con Codex

## Packshot completo

> Usa `image_orchestrator` para producir un packshot horizontal de 500 ml, 1,5 L, 5 L y 18 L. Toma `docs/image-agents/assets/omi-products-approved-reference.png` como referencia de producto y el PDF original como fuente de marca. Fondo blanco azulado, superficie con reflejo suave y etiquetas transparentes. Aplica los elementos exactos con `brand_compositor` y no termines sin `image_visual_qa = PASS`.

## Cambio localizado

> Usa el flujo visual para convertir únicamente las etiquetas de 500 ml, 1,5 L y 5 L en film transparente. Conserva idénticos botellas, encuadre, fondo, iluminación, posiciones, logo, textos y formato de 18 L. Haz una sola edición y ejecuta QA comparativo.

## Productos sin fondo

> Extrae cada formato OMI en un PNG independiente con alfa real, producto completo, 8 % de margen y 2400 px de alto. No hornees un checkerboard. Conserva branding y proporciones; valida cada salida por separado.

## Hero web

> Diseña tres direcciones de hero para OMI usando los cuatro formatos aprobados y espacio de copy a la izquierda. No generes todavía. Compara claridad, frescura, diferenciación y comportamiento en móvil; recomienda una.

## Corrección de marca

> Usa `brand_compositor` para sustituir el logo aproximado del render por el arte exacto del PDF, conservando perspectiva, reflejos y etiqueta transparente. No cambies la escena. Pasa después `image_visual_qa`.

## Exportación web

> Desde el master aprobado crea PNG con transparencia y derivados WebP/AVIF para Next.js. No alteres el master. Informa dimensiones, peso y uso recomendado, y valida que no existan halos en los bordes.
