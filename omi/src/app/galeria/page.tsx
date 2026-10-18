import type { Metadata } from "next";
import { Footer } from "@/src/components/Footer";
import { Gallery } from "@/src/components/Gallery";
import { Navbar } from "@/src/components/Navbar";

export const metadata: Metadata = {
  title: "Galería | OMI",
  description: "Galería de imágenes y vídeos de los formatos de agua mineral OMI.",
};

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#f2f9ff] py-16 sm:py-20" aria-labelledby="gallery-page-title">
          <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full border-[48px] border-white/70" aria-hidden="true" />
          <div className="page-container relative">
            <p className="eyebrow">Galería</p>
            <h1 id="gallery-page-title" className="mt-5 max-w-3xl text-4xl font-bold tracking-[-.04em] text-[#061643] sm:text-5xl lg:text-6xl">Galería OMI</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Descubre OMI en cada formato.</p>
          </div>
        </section>
        <Gallery />
      </main>
      <Footer />
    </>
  );
}
