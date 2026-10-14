"use client";
import { useEffect, useRef } from "react";

// const COLORS = ["#f0338f", "#6fa3dc", "#ffd166", "#ffffff", "#7be0ad", "#b794f4"];

const COLORS = ["#c98b54", "#f3d9b1", "#ffffff", "#7a4a2b", "#e8b04a"];
type Particle = {
  x: number; y: number; vx: number; vy: number;
  life: number; rot: number; vr: number; c: string; s: number;
};

export default function MouseEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const root = document.documentElement;
    const parts: Particle[] = [];
    let w = 0, h = 0, raf = 0, lastX = 0, lastY = 0;

    const resize = () => {
      const d = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * d;
      canvas.height = h * d;
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };
    resize();

    const spawn = (x: number, y: number, n: number, speed: number) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = Math.random() * speed;
        parts.push({
          x, y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v - 1,
          life: 1,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.4,
          c: COLORS[Math.floor(Math.random() * COLORS.length)],
          s: 3 + Math.random() * 3,
        });
      }
      if (parts.length > 300) parts.splice(0, parts.length - 300);
    };

    const onMove = (e: PointerEvent) => {
      root.style.setProperty("--mx", `${e.clientX}px`);
      root.style.setProperty("--my", `${e.clientY}px`);
      root.style.setProperty("--xp", String(e.clientX / w));
      if (Math.hypot(e.clientX - lastX, e.clientY - lastY) > 16) {
        spawn(e.clientX, e.clientY, 1, 1.5);
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };
    const onClick = (e: PointerEvent) => spawn(e.clientX, e.clientY, 24, 7);

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.99;
        p.rot += p.vr; p.life -= 0.018;
        if (p.life <= 0) { parts.splice(i, 1); continue; }
        ctx.save();
        ctx.globalAlpha = p.life;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.roundRect(-p.s * 1.6, -p.s / 2, p.s * 3.2, p.s, p.s / 2);
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onClick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onClick);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* Colour glow that follows the mouse and shifts hue from left to right */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-20 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(520px circle at var(--mx, 70%) var(--my, 30%), hsl(calc(25 + var(--xp, 0.5) * 30) 100% 80% / 0.75), transparent 65%)",
        }}
      />
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-50" />
    </>
  );
}