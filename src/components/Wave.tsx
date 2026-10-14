type Props = {
  fillClass: string;   // e.g. "fill-sky"
  className?: string;  // positioning
  speed?: number;      // seconds per loop, higher = slower
};

const PATH =
  "M0 60 C240 0 480 0 720 60 S1200 120 1440 60 C1680 0 1920 0 2160 60 S2640 120 2880 60 V120 H0 Z";

export default function Wave({ fillClass, className = "", speed = 14 }: Props) {
  const layers = [
    { opacity: "opacity-50", dur: speed * 1.5, reverse: true },
    { opacity: "opacity-100", dur: speed, reverse: false },
  ];

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 h-14 overflow-hidden md:h-24 ${className}`}
    >
      {layers.map((l, i) => (
        <svg
          key={i}
          viewBox="0 0 2880 120"
          preserveAspectRatio="none"
          className={`wave-slide absolute inset-y-0 left-0 h-full w-[200%] ${l.opacity}`}
          style={{
            ["--speed" as string]: `${l.dur}s`,
            animationDirection: l.reverse ? "reverse" : "normal",
          }}
        >
          <path d={PATH} className={fillClass} />
        </svg>
      ))}
    </div>
  );
}