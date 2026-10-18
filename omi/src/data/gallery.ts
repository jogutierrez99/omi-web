type GalleryBase = {
  id: string;
  src: string;
  title: string;
  description: string;
  width: number;
  height: number;
  featured?: boolean;
};

export type GalleryItem = GalleryBase & (
  | { type: "video"; poster: string }
  | { type: "image" }
);

export const galleryItems: GalleryItem[] = [
  { id: "familia", type: "video", src: "/media/galeria/omi-familia.mp4", poster: "/media/galeria/omi-familia.jpg", title: "Familia OMI", description: "Los cuatro formatos de agua mineral OMI sobre un fondo azul marino.", width: 1280, height: 720, featured: true },
  { id: "330cc", type: "video", src: "/media/galeria/omi-330cc.mp4", poster: "/media/galeria/omi-330cc.jpg", title: "OMI 330 cc", description: "Botella de agua mineral OMI de 330 cc, vista completa en movimiento.", width: 720, height: 1280 },
  { id: "1-5l", type: "video", src: "/media/galeria/omi-1-5l.mp4", poster: "/media/galeria/omi-1-5l.jpg", title: "OMI 1,5 L", description: "Botella de agua mineral OMI de 1,5 litros, vista completa en movimiento.", width: 720, height: 1280 },
  { id: "5l", type: "video", src: "/media/galeria/omi-5l.mp4", poster: "/media/galeria/omi-5l.jpg", title: "OMI 5 L", description: "Envase de agua mineral OMI de 5 litros con asa, visto completo en movimiento.", width: 720, height: 1280 },
  { id: "18l", type: "video", src: "/media/galeria/omi-18l.mp4", poster: "/media/galeria/omi-18l.jpg", title: "OMI 18 L", description: "Botellón de agua mineral OMI de 18 litros, visto completo en movimiento.", width: 720, height: 1280 },
];
