"use client";
import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type CartItem = { id: string; name: string; price: number };
export type Line = { item: CartItem; qty: number };

type CartCtx = {
  lines: Line[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  checkout: boolean;
  setCheckout: (v: boolean) => void;
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);

  const value = useMemo<CartCtx>(
    () => ({
      lines,
      open,
      setOpen,
      checkout,
      setCheckout,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + l.qty * l.item.price, 0),
      add: (item) =>
        setLines((prev) =>
          prev.some((l) => l.item.id === item.id)
            ? prev.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l))
            : [...prev, { item: { id: item.id, name: item.name, price: item.price }, qty: 1 }]
        ),
      remove: (id) =>
        setLines((prev) =>
          prev.flatMap((l) =>
            l.item.id !== id ? [l] : l.qty > 1 ? [{ ...l, qty: l.qty - 1 }] : []
          )
        ),
      clear: () => setLines([]),
    }),
    [lines, open, checkout]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}