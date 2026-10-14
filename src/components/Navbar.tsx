"use client";
import { Phone, ShoppingBasket } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { WHATSAPP_NUMBER } from "@/data/config";
import Logo from "./Logo";

export default function Navbar() {
  const { count, setOpen } = useCart();

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a href="#" aria-label="Donut home" className="text-3xl text-sky">
          <Logo />
        </a>

        <div className="flex items-center gap-6 text-white">
          <a href={`tel:+${WHATSAPP_NUMBER}`} className="hidden items-center gap-2 sm:flex">
            <Phone size={16} />
            <span className="text-xs font-bold leading-tight">
              +{WHATSAPP_NUMBER}
              <br />
              <span className="opacity-80">call or WhatsApp to order</span>
            </span>
          </a>

          <button onClick={() => setOpen(true)} className="flex items-center gap-2" aria-label="Open basket">
            <ShoppingBasket size={22} />
            <span className="text-left text-xs font-bold leading-tight">
              Basket
              <br />
              <span className="opacity-80">{count ? `${count} item${count > 1 ? "s" : ""}` : "empty"}</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}