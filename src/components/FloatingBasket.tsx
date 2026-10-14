"use client";
import { ShoppingBasket } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function FloatingBasket() {
  const { count, setOpen } = useCart();

  return (
    <button
      onClick={() => setOpen(true)}
      aria-label={`Open basket, ${count} items`}
      className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-white text-sky shadow-xl transition hover:scale-110 active:scale-90"
    >
      <ShoppingBasket size={26} />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-rose px-1 text-xs font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}