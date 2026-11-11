import { AboutUs } from "@/src/components/AboutUs";
import { Contact } from "@/src/components/Contact";
import { Footer } from "@/src/components/Footer";
import { Franchises } from "@/src/components/Franchises";
import { Hero } from "@/src/components/Hero";
import { Location } from "@/src/components/Location";
import { Navbar } from "@/src/components/Navbar";
import { Recognition } from "@/src/components/Recognition";
import { RechargePromotion } from "@/src/components/RechargePromotion";
import { Services } from "@/src/components/Services";
import { SocialNetworks } from "@/src/components/SocialNetworks";
import { pageMetadata, siteStructuredData } from "@/src/lib/seo";

export const metadata = pageMetadata({
  path: "/",
  title: "OMI | Agua Mineral Natural de los Valles de Aragua",
  description: "Descubre OMI, agua mineral natural de mineralización suave procedente de los Valles de Aragua, Venezuela. Conoce nuestra historia y nuestros formatos.",
});

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteStructuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />
      <main>
        <Hero />
        <AboutUs />
        <Location />
        <Services />
        <RechargePromotion />
        <Recognition />
        <Franchises />
        <Contact />
        <SocialNetworks />
      </main>
      <Footer />
    </>
  );
}
