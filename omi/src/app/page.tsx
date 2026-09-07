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

export default function Home() {
  return (
    <>
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
