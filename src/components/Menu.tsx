"use client";
import { useState } from "react";
import { categories, money } from "@/data/menu";
import { useCart } from "@/context/CartContext";
import SafeImage from "./SafeImage";
import TiltCard from "./TiltCard";
import FunButton from "./FunButton";

const EMOJIS = ["🍫", "🍪", "🤎", "✨"];

export default function Menu() {
  const { add } = useCart();
  const [active, setActive] = useState(categories[0].id);
  const current = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <section id="menu" className="bg-sky pb-28 pt-10">
      <h2 className="text-center font-display text-4xl tracking-wide text-white">Our menu</h2>

      <div
        role="tablist"
        aria-label="Menu categories"
        className="mx-auto mt-8 flex max-w-4xl gap-3 overflow-x-auto px-6 pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible"
      >
        {categories.map((c) => (
          <button
            key={c.id}
            role="tab"
            aria-selected={c.id === active}
            onClick={() => setActive(c.id)}
            className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold uppercase tracking-wide transition active:scale-95 ${
              c.id === active ? "bg-white text-sky shadow-lg" : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <p className="mx-auto mt-4 max-w-md px-6 text-center font-semibold text-white">{current.tagline}</p>

      <div
        key={current.id}
        className="mx-auto mt-40 flex max-w-4xl flex-wrap justify-center gap-x-6 gap-y-44 px-6"
      >
        {current.items.map((p) => (
          <div key={p.id} className="w-full sm:w-[calc(50%_-_0.75rem)] lg:w-[calc(33.333%_-_1rem)]">
            <TiltCard className="rounded-2xl border border-white/30 bg-white/20 px-5 pb-8 pt-36 text-center text-white shadow-lg">
              {/* circular photo that pops out of the card */}
              <div className="absolute inset-x-0 -top-28 flex justify-center [transform:translateZ(80px)]">
                <SafeImage
                  src={p.image}
                  alt={p.name}
                  width={500}
                  height={500}
                  className="h-56 w-56 rounded-full border-4 border-white/50 object-cover shadow-xl md:h-60 md:w-60"
                  fallback={
                    <div className="grid h-56 w-56 place-items-center rounded-full border-4 border-white/50 bg-white/25 text-7xl shadow-xl md:h-60 md:w-60">
                      🧁
                    </div>
                  }
                />
              </div>

              <h3 className="flex min-h-[3.25rem] items-center justify-center font-display text-xl leading-tight">
                {p.name}
              </h3>
              <p className="mt-2 min-h-6 text-sm font-semibold leading-snug">{p.description}</p>
              <p className="mt-3 font-display text-2xl">{money(p.price)}</p>

              <div className="mt-4">
                <FunButton className="bg-candy" emojis={EMOJIS} onClick={() => add(p)}>
                  Add to basket
                </FunButton>
              </div>
            </TiltCard>
          </div>
        ))}
      </div>
    </section>
  );
}