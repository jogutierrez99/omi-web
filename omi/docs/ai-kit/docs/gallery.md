# Galería OMI

La galería está en la ruta independiente `/galeria`. La navegación principal y el pie de página enlazan a esa ruta.

## Gestionar contenido

1. Guarda el recurso en `public/media/galeria/`.
2. Añade o retira un elemento en `src/data/gallery.ts`. La ruta pública empieza por `/media/galeria/`, sin `public`.
3. Indica las dimensiones reales para reservar espacio sin recortar el producto. Usa `featured: true` para ocupar toda la fila.

Ejemplo de imagen:

```ts
{
  id: "nueva-imagen",
  type: "image",
  src: "/media/galeria/nueva-imagen.jpg",
  title: "Título aprobado",
  description: "Descripción del contenido de la imagen",
  width: 1280,
  height: 720,
}
```

Para un vídeo, usa `type: "video"`, su ruta `.mp4` y añade `poster: "/media/galeria/nuevo-video.jpg"` con un fotograma real. Conserva un identificador único.

## Recursos originales

Los cinco MP4 se copiaron sin recomprimir desde los adjuntos. Familia: 1280 × 720; individuales: 720 × 1280; duración: 8 segundos. Los JPG son fotogramas extraídos en el segundo 1.

El adjunto pequeño disponible es `OMI_330cc_animacion_8s.mp4`. El nombre `OMI_330cc_nuevo_animacion_8s.mp4` mencionado en el encargo no estaba disponible. Se verificó visualmente que el archivo aportado muestra OMI 330 cc.

## Desarrollo y comprobaciones

Desde la carpeta `omi`, ejecuta `npm run dev` y abre `http://localhost:3000/galeria`.

- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- `node scripts/gallery-image-check.mjs`: comprobación dirigida del renderizado de imágenes.
- `node scripts/gallery-browser-check.mjs`: pruebas locales en Edge; requiere Playwright disponible y el servidor en el puerto 3000. Guarda capturas en `docs/ai-kit/evals/`.
- `node scripts/gallery-media-check.mjs`: vuelve a extraer y sobrescribe los pósteres JPG; requiere el mismo servidor y Playwright. No lo ejecutes durante QA rutinario.

Los scripts de navegador aceptan `PLAYWRIGHT_MODULE` como URL de archivo del módulo Playwright si se usa un runtime externo. No se añadió ninguna dependencia de producción.

Los vídeos de tarjetas solo solicitan reproducción al entrar en pantalla. Movimiento reducido impide el inicio automático; el botón permite iniciar manualmente. La pestaña oculta pausa tanto tarjetas como vídeo ampliado. La vista ampliada ofrece controles nativos y requiere inicio voluntario.

## Validación de esta entrega

- PASS: lint, TypeScript y renderizado dirigido de la variante imagen.
- PASS: navegador Edge a 1440, 768 y 390 px; navegación, ausencia de overflow, carga diferida, reproducción silenciosa en bucle, pausa fuera de pantalla, evento de pestaña oculta simulado, movimiento reducido e inicio manual, rechazo de autoplay simulado, apertura/cierre, Escape, devolución y confinamiento del foco, recorrido de controles nativos e inicio con teclado.
- PASS: respuestas HTTP de recursos de galería sin errores y sin errores JavaScript nuevos durante la suite.
- PASS: proporciones, duración, revisión visual de los productos y hashes SHA-256 idénticos para los cinco vídeos copiados.
- PASS: build de producción mediante `npx next build --webpack`.
- LIMITACIÓN: `npm run build` (Turbopack) falló primero al descargar las fuentes Geist bajo restricciones de red y, con acceso de red, por un error interno al iniciar un proceso para el CSS existente de `flag-icons`. Se validó con Webpack sin modificar la configuración ni las dependencias del proyecto.
