"use client";
import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { specials, money } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import Wave from "./Wave";

function AddButton({ id, name, price }: { id: string; name: string; price: number }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);

  return (
    <button
      onClick={() => {
        add({ id, name, price });
        setDone(true);
        setTimeout(() => setDone(false), 900);
      }}
      aria-label={`Add ${name} to basket`}
      className={`grid h-10 w-10 shrink-0 place-items-center rounded-full shadow-md transition active:scale-90 ${
        done ? "scale-110 bg-white text-sky" : "bg-sky text-white hover:scale-110"
      }`}
    >
      {done ? <Check size={18} /> : <Plus size={18} />}
    </button>
  );
}

export default function Specials() {
  return (
    <section id="specials" className="relative bg-mauve pb-32 pt-8">
      <Wave fillClass="fill-mauve" className="bottom-full translate-y-px" speed={16} />

      <h2 className="text-center font-display text-4xl tracking-wide text-white">Specials &amp; bundles</h2>

      <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/20 bg-white/10 p-4 shadow-lg backdrop-blur-sm sm:p-8">
        <ul className="space-y-6">
          {specials.map((s) => (
            <li key={s.id} className="flex items-center gap-4 text-white">
              <div className="min-w-0 flex-1">
                <p className="text-base font-bold leading-snug sm:text-lg">{s.name}</p>
                {s.description && <p className="mt-1 text-sm font-semibold text-white/75">{s.description}</p>}
              </div>
              <span className="shrink-0 font-display text-xl text-amber-200">{money(s.price)}</span>
              <AddButton id={s.id} name={s.name} price={s.price} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}