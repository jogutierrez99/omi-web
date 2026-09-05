# Checklist de QA visual OMI

## Archivo

- [ ] Dimensiones y relación de aspecto correctas.
- [ ] Formato correcto y archivo íntegro.
- [ ] Canal alfa real cuando se pidió fondo transparente.
- [ ] El producto completo está dentro del lienzo y tiene margen útil.
- [ ] Existe master sin pérdida antes de los derivados comprimidos.

## Producto

- [ ] Número exacto de envases.
- [ ] Formatos y escalas relativas correctos.
- [ ] Tapas, asa, siluetas y nervaduras correctas.
- [ ] Agua, plástico, condensación y reflejos físicamente coherentes.
- [ ] No hay deformaciones, duplicaciones ni geometría inventada.

## Marca

- [ ] Logo OMI correcto y no deformado.
- [ ] `AGUA MINERAL` está escrito exactamente.
- [ ] `Tu salud lo vale` está escrito exactamente.
- [ ] Capacidad correcta en cada formato.
- [ ] Sello dorado presente donde corresponda.
- [ ] Etiqueta transparente, sin bloque blanco opaco.
- [ ] Los elementos exactos proceden del arte original.

## Composición

- [ ] Encuadre, posición, escala y orden respetan la especificación.
- [ ] Sombras de contacto y reflejos son coherentes.
- [ ] No hay halos, bordes recortados, cuadros horneados ni artefactos.
- [ ] El espacio para texto/CTA funciona en el destino previsto.
- [ ] El recorte sigue siendo útil en móvil y escritorio si es un hero.

## Veredicto

- Cualquier fallo de marca, capacidad, formato, alfa o invariante bloqueado: `REJECT`.
- Solo desviaciones menores no visibles al tamaño de uso: `PASS_WITH_WARNINGS`.
- Todo correcto y comprobado: `PASS`.
