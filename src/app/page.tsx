import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Specials from "@/components/Specials";
import CtaBand from "@/components/CtaBand";
import Footer from "@/components/Footer";
import MouseEffects from "@/components/MouseEffects";
import BasketDrawer from "@/components/BasketDrawer";
import FloatingBasket from "@/components/FloatingBasket";
import CheckoutModal from "@/components/CheckoutModal";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <MouseEffects />
      <Navbar />
      <Hero />
      <Menu />
      <Specials />
      <CtaBand />
      <Footer />
      <FloatingBasket />
      <BasketDrawer />
      <CheckoutModal />
    </main>
  );
}