"use client";
import { useCart } from "@/context/CartContext";
import FunButton from "./FunButton";

export default function BasketButton({ variant = "blue" }: { variant?: "blue" | "pink" }) {
  const { setOpen } = useCart();

  return (
    <FunButton className={variant === "blue" ? "bg-sky" : "bg-candy"} onClick={() => setOpen(true)}>
      Go to basket
    </FunButton>
  );
}