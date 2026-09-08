import type { Metadata } from "next";
import { ContactForm } from "@/src/components/contact/ContactForm";
import { ContactInfo } from "@/src/components/contact/ContactInfo";
import { Footer } from "@/src/components/Footer";
import { Navbar } from "@/src/components/Navbar";

export const metadata: Metadata = {
  title: "Contacto | OMI",
  description: "Contacta con OMI para solicitar información sobre nuestros productos, distribución y agua mineral.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#f2f9ff] py-16 sm:py-20" aria-labelledby="contact-page-title">
          <div className="pointer-events-none absolute -right-24 -top-28 size-80 rounded-full border-[48px] border-white/70" aria-hidden="true" />
          <div className="page-container relative">
            <p className="eyebrow">Contacto</p>
            <h1 id="contact-page-title" className="mt-5 max-w-3xl text-4xl font-bold tracking-[-.04em] text-[#061643] sm:text-5xl lg:text-6xl">Contacta con OMI</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">Estamos aquí para ayudarte. Escríbenos y nuestro equipo se pondrá en contacto contigo.</p>
          </div>
        </section>
        <section className="section-space bg-white" aria-label="Formulario e información de contacto">
          <div className="page-container grid items-start gap-8 lg:grid-cols-[.85fr_1.15fr] lg:gap-12">
            <ContactInfo />
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
