type GalleryBase = {
  id: string;
  src: string;
  title: string;
  description: string;
  width: number;
  height: number;
  featured?: boolean;
  centered?: boolean;
};

export type GalleryItem = GalleryBase & (
  | { type: "video"; poster: string }
  | { type: "image" }
);

export const galleryItems: GalleryItem[] = [
  { id: "familia", type: "video", src: "/media/galeria/omi-familia-v2.mp4", poster: "/media/galeria/omi-familia.webp", title: "Familia OMI", description: "Los cuatro formatos de agua mineral OMI sobre un fondo azul marino.", width: 1280, height: 720, featured: true },
  { id: "origen-botella", type: "video", src: "/media/galeria/omi-origen-botella-v2.mp4", poster: "/media/galeria/omi-origen-botella-v2.webp", title: "Del origen a la botella", description: "Recorrido por el origen del agua, el proceso de llenado y las instalaciones de OMI.", width: 720, height: 1280, centered: true },
];
