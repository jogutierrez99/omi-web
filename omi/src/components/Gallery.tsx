import { galleryItems } from "@/src/data/gallery";
import { GalleryMedia } from "./gallery/GalleryMedia";

export function Gallery() {
  return (
    <section id="galeria" aria-label="Galería multimedia de OMI" className="section-space bg-white">
      <div className="page-container">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {galleryItems.map(item => (
            <div key={item.id} className={item.featured ? "h-full sm:col-span-2 lg:col-span-4" : "h-full min-w-0"}>
              <GalleryMedia item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
