import Media from "./Media";
import Wave from "./Wave";
import BasketButton from "./BasketButton";

// Add or remove entries to match the floating photos you have
const floaters = [
  { src: "/images/icon1.png", cls: "-left-8 -top-8 w-28 sm:-left-10 sm:-top-10 sm:w-40 md:w-56", dur: 6, delay: 0 },
  { src: "/images/icon2.png", cls: "-right-4 -top-10 w-24 sm:right-[10%] sm:-top-14 sm:w-32 md:w-44", dur: 7, delay: 0.5 },
  { src: "/images/icon3.png", cls: "-right-6 -bottom-4 w-28 sm:-right-8 sm:-bottom-6 sm:w-36 md:w-52", dur: 6.5, delay: 2 },
];

export default function CtaBand() {
  return (
    <section className="relative bg-sky py-24 md:py-28">
      <Wave fillClass="fill-sky" className="bottom-full translate-y-px" speed={18} />

      {floaters.map((f) => (
        <Media
          key={f.src}
          src={f.src}
          alt=""
          width={260}
          height={260}
          className={`float absolute z-10 drop-shadow-xl ${f.cls}`}
          style={{ ["--dur" as string]: `${f.dur}s`, ["--delay" as string]: `${f.delay}s` }}
        />
      ))}

      <div className="relative mx-auto max-w-md px-6 text-center text-white">
        <h2 className="font-display text-3xl leading-tight md:text-4xl">Treat yourself to something special</h2>
        <p className="mt-3 font-semibold text-white/90">Order online, or send a DM on Instagram</p>
        <div className="mt-6">
          <BasketButton variant="pink" />
        </div>
      </div>
    </section>
  );
}