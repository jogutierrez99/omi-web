import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/src/components/Footer";
import { Navbar } from "@/src/components/Navbar";

export const metadata: Metadata = {
  title: "Noticias | OMI",
  description: "Noticias y novedades de OMI. Próximamente compartiremos nuevas publicaciones.",
};

export default function NewsPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#f2f9ff] py-16 sm:py-20" aria-labelledby="news-page-title">
          <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full border-[48px] border-white/70" aria-hidden="true" />
          <div className="page-container relative">
            <p className="eyebrow">Actualidad OMI</p>
            <h1 id="news-page-title" className="mt-5 max-w-3xl text-4xl font-bold tracking-[-.04em] text-[#061643] sm:text-5xl lg:text-6xl">Noticias</h1>
          </div>
        </section>
        <section className="section-space bg-white" aria-labelledby="news-coming-soon">
          <div className="page-container">
            <div className="mx-auto max-w-2xl rounded-2xl border border-blue-100 bg-[#f8fcff] px-6 py-12 text-center sm:px-12 sm:py-16">
              <p className="eyebrow justify-center">Muy pronto</p>
              <h2 id="news-coming-soon" className="mt-5 text-3xl font-bold tracking-tight text-[#061643] sm:text-4xl">Estamos preparando novedades</h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">Próximamente compartiremos aquí las noticias y novedades de OMI.</p>
              <Link href="/" className="button-secondary mt-8">Volver al inicio</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
