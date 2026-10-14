"use client";
import { useRef } from "react";
import { Flame, Gift, MapPin, Truck } from "lucide-react";
import Media from "./Media";
import Wave from "./Wave";
import FunButton from "./FunButton";
import { BUSINESS_NAME } from "@/data/config";

const HERO_SRC = "/images/hero.png"; // use your current hero file name

const features = [
  { icon: Flame, title: "Premium baked goods", text: "Fudgy brownies & rich loaves" },
  { icon: Truck, title: "We deliver", text: "Kaduna, Kano, Abuja, Jos & Lagos" },
  { icon: Gift, title: "Perfect for gifting", text: "Boxes, bundles & a sample box" },
  { icon: MapPin, title: "Based in Kaduna", text: "Order online or by DM" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", String(((e.clientX - r.left) / r.width - 0.5) * 2));
    el.style.setProperty("--py", String(((e.clientY - r.top) / r.height - 0.5) * 2));
  };
  const onLeave = () => {
    ref.current?.style.setProperty("--px", "0");
    ref.current?.style.setProperty("--py", "0");
  };

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative overflow-hidden bg-gradient-to-br from-[#7a4a2b] to-[#4a2c1a] pb-40 pt-36 md:pb-52 md:pt-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-10 h-80 w-80 rounded-full bg-white/15 blur-3xl transition-transform duration-300 ease-out"
        style={{ transform: "translate3d(calc(var(--px, 0) * -50px), calc(var(--py, 0) * -50px), 0)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-10 bottom-20 h-96 w-96 rounded-full bg-sky/40 blur-3xl transition-transform duration-300 ease-out"
        style={{ transform: "translate3d(calc(var(--px, 0) * 60px), calc(var(--py, 0) * 40px), 0)" }}
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="font-display text-5xl leading-[1.05] text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.25)] md:text-7xl">
              Ordinary moments, made special
            </h1>
            <p className="mt-6 text-xl font-bold text-white">
              Brownies, banana bread &amp; stuffed cookies from Kaduna
            </p>
            <div className="mt-8">
              <FunButton
                onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              >
                Order now
              </FunButton>
            </div>
          </div>

          {/* circular hero photo that follows the mouse and bobs gently */}
          <div
            className="flex justify-center transition-transform duration-200 ease-out"
            style={{ transform: "translate3d(calc(var(--px, 0) * 28px), calc(var(--py, 0) * 22px), 0)" }}
          >
            <div className="bob aspect-square w-full max-w-[18rem] overflow-hidden rounded-full border-[6px] border-white/30 shadow-2xl sm:max-w-sm md:max-w-md">
              <Media
                src={HERO_SRC}
                alt={`${BUSINESS_NAME} baked goods`}
                width={900}
                height={900}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <ul className="relative z-10 mt-14 grid grid-cols-2 gap-6 md:mt-20 md:grid-cols-4">
          {features.map(({ icon: Icon, title, text }) => (
            <li key={title} className="group flex cursor-pointer items-center gap-3 text-white">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-sky shadow-md transition duration-300 group-hover:rotate-12 group-hover:scale-125 group-hover:bg-white group-hover:text-sky">
                <Icon size={24} />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-bold uppercase tracking-wide">{title}</span>
                <span className="text-xs font-semibold">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Wave fillClass="fill-sky" className="bottom-0" />
    </section>
  );
}