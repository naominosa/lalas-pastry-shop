"use client";
import { useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  emojis?: string[];
};

export default function FunButton({
  children,
  onClick,
  className = "bg-sky",
  emojis = ["🍫", "🍪", "✨", "🤎"],
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [bursts, setBursts] = useState<{ id: number; e: string; dx: number; dy: number }[]>([]);

  // Button drifts toward the cursor
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const handleClick = () => {
    const now = Date.now();
    const items = Array.from({ length: 7 }, (_, i) => ({
      id: now + i,
      e: emojis[i % emojis.length],
      dx: Math.cos((i / 7) * Math.PI * 2) * 75,
      dy: Math.sin((i / 7) * Math.PI * 2) * 75 - 20,
    }));
    setBursts((b) => [...b, ...items]);
    setTimeout(() => setBursts((b) => b.filter((x) => !items.some((i) => i.id === x.id))), 800);
    onClick?.();
  };

  return (
    <button
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={handleClick}
      className={`group relative rounded-full px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-black/20 transition duration-200 ease-out hover:scale-110 hover:shadow-xl active:scale-90 ${className}`}
    >
      {/* shine sweep */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/50 transition-transform duration-700 group-hover:translate-x-[450%]" />
      </span>

      <span className="relative">{children}</span>

      {bursts.map((b) => (
        <span
          key={b.id}
          aria-hidden="true"
          className="burst pointer-events-none absolute left-1/2 top-1/2 text-xl"
          style={{ ["--dx" as string]: `${b.dx}px`, ["--dy" as string]: `${b.dy}px` }}
        >
          {b.e}
        </span>
      ))}
    </button>
  );
}