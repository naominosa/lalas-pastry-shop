"use client";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { money } from "@/data/menu";

export default function BasketDrawer() {
  const { lines, total, open, setOpen, add, remove, setCheckout } = useCart();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Your basket">
      <button
        aria-label="Close basket"
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* bottom sheet on phones, side panel on bigger screens */}
      <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white p-5 text-neutral-800 shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-96 sm:rounded-none sm:rounded-l-3xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-2xl text-sky">Your basket</h3>
          <button onClick={() => setOpen(false)} aria-label="Close" className="rounded-full p-1 hover:bg-neutral-100">
            <X size={22} />
          </button>
        </div>

        {lines.length === 0 ? (
          <p className="py-10 text-center font-semibold text-neutral-500">
            Nothing here yet 🍩
            <br />
            Pick a donut or a drink!
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {lines.map(({ item, qty }) => (
                <li key={item.id} className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{item.name}</p>
                    <p className="text-sm text-neutral-500">{money(item.price)} each</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => remove(item.id)}
                      aria-label={`Remove one ${item.name}`}
                      className="grid h-8 w-8 place-items-center rounded-full bg-candy text-white active:scale-90"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-5 text-center font-bold">{qty}</span>
                    <button
                      onClick={() => add(item)}
                      aria-label={`Add one ${item.name}`}
                      className="grid h-8 w-8 place-items-center rounded-full bg-sky text-white active:scale-90"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>

            <button
              onClick={() => {
                setOpen(false);
                setCheckout(true);
              }}
              className="mt-5 w-full rounded-full bg-sky py-3 font-bold uppercase tracking-wider text-white shadow-lg transition hover:brightness-110 active:scale-95"
            >
              Checkout
            </button>
          </>
        )}
      </div>
    </div>
  );
}