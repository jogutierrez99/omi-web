# Workflow visual

## Imagen nueva de producto o campaña

1. El orquestador clasifica destino y fidelidad.
2. Referencias identifica fuentes, hechos, incertidumbres e invariantes.
3. Especificación define producto, cámara, luz, materiales, composición y archivo.
4. Dirección artística propone alternativas y recomienda una.
5. Prompt engineer prepara una operación ejecutable.
6. Productor genera la escena base.
7. Compositor aplica marca exacta cuando corresponda.
8. QA compara todo y emite PASS o REJECT.

## Edición localizada

1. Usa siempre la última imagen aprobada como base.
2. Declara una región editable y una lista de invariantes.
3. Ejecuta un único cambio coherente.
4. Compara la salida con la base completa, no solo con el detalle editado.
5. Si la corrección afecta logo o texto, prioriza composición determinista.

## Bucle de corrección

- Fallo de concepto: vuelve a `image_art_director`.
- Falta de definición: vuelve a `product_image_specification`.
- Prompt ambiguo: vuelve a `image_prompt_engineer`.
- Botella, escena, material o luz: vuelve a `image_producer`.
- Logo, capacidad, eslogan, sello o texto: vuelve a `brand_compositor`.
- Tras cualquier corrección: vuelve a `image_visual_qa`.

Máximo tres ciclos. Si el mismo defecto grave persiste, el estado es `blocked` y se identifica el activo, decisión o capacidad técnica necesaria.

## Estados

- `pending`
- `running`
- `completed`
- `completed_with_warnings`
- `needs_input`
- `blocked`
- `failed`

Para una imagen final, `completed` exige archivo accesible, criterios cubiertos y `image_visual_qa = PASS`.
