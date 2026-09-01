import { AboutUs } from "@/src/components/AboutUs";
import { Contact } from "@/src/components/Contact";
import { Footer } from "@/src/components/Footer";
import { Hero } from "@/src/components/Hero";
import { Navbar } from "@/src/components/Navbar";
import { RechargePromotion } from "@/src/components/RechargePromotion";
import { Services } from "@/src/components/Services";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <RechargePromotion />
        <AboutUs />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
