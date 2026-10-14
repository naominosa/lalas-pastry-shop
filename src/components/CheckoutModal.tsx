"use client";
import { useEffect, useState, type ReactNode } from "react";
import { Check, Heart, Phone, Send, X } from "lucide-react";
import { useCart, type Line } from "@/context/CartContext";
import { money } from "@/data/menu";

const PAYMENTS = [
  { label: "Cash", emoji: "💵" },
  { label: "Bank Transfer", emoji: "🏦" },
  { label: "E-Wallet", emoji: "📱" },
  { label: "Other", emoji: "" },
];

const MIN_ROWS = 6;
const COLS =
  "grid-cols-[1.75rem_minmax(0,1fr)_2rem_3.75rem_4.25rem] sm:grid-cols-[2.5rem_minmax(0,1fr)_3rem_5rem_5.5rem]";

function makeMeta() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return {
    no: `LP-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${Math.floor(
      1000 + Math.random() * 9000
    )}`,
    date: d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  };
}

function Box({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-[#d9bd9c] bg-[#fff9f5] px-4 py-3">
      <span className="whitespace-nowrap font-bold text-[#4a2c1a]">{label} :</span>
      <span className="min-w-0 flex-1 border-b border-dotted border-[#c4a07a] px-1 text-[#4a2c1a]">{children}</span>
    </div>
  );
}

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="absolute -top-3 left-4 rounded bg-[#ead3b8] px-3 py-0.5 text-xs font-bold text-[#9a5f33]">
      {children}
    </span>
  );
}

/* The gingham + cream card that wraps everything */
function Frame({ children }: { children: ReactNode }) {
  const { setCheckout } = useCart();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCheckout(false);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [setCheckout]);

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto" role="dialog" aria-modal="true" aria-label="Order receipt">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setCheckout(false)} />

      <div className="relative mx-auto my-4 w-full max-w-xl px-3 sm:my-8">
        <div className="gingham rounded-[2rem] p-3 shadow-2xl sm:p-4">
          <div className="relative rounded-[2rem] bg-[#fff4ec] p-2 sm:p-3">
            <button
              onClick={() => setCheckout(false)}
              aria-label="Close receipt"
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white text-[#9a5f33] shadow-md active:scale-90"
            >
              <X size={18} />
            </button>
            <div className="rounded-[1.6rem] border-2 border-dashed border-[#d9bd9c] px-4 pb-6 pt-6 sm:px-7">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Receipt() {
  const { lines, total, setCheckout, setOpen, clear } = useCart();
  const [meta] = useState(makeMeta);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState("");
  const [other, setOther] = useState("");
  const [notes, setNotes] = useState("");
  const [honey, setHoney] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [sent, setSent] = useState({ name: "", phone: "", no: "" });

  const rows: (Line | undefined)[] = Array.from(
    { length: Math.max(MIN_ROWS, lines.length) },
    (_, i) => lines[i]
  );

  const paymentLabel = payment === "Other" ? (other.trim() ? `Other - ${other.trim()}` : "Other") : payment;

  const validate = () => {
    if (lines.length === 0) return setError("Your basket is empty."), false;
    if (!name.trim()) return setError("Please add your name."), false;
    if (phone.replace(/\D/g, "").length < 7) return setError("Please add a phone number we can reach you on."), false;
    setError("");
    return true;
  };

  const placeOrder = async () => {
    if (!validate()) return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          payment: paymentLabel,
          notes,
          receiptNo: meta.no,
          date: meta.date,
          website: honey,
          items: lines.map(({ item, qty }) => ({ id: item.id, qty })),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setSent({ name: name.trim(), phone: phone.trim(), no: meta.no });
      clear();
      setStatus("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  /* ---------- thank-you screen ---------- */
  if (status === "sent") {
    return (
      <Frame>
        <div className="py-8 text-center text-[#4a2c1a]">
          <p className="text-6xl">🍩</p>
          <h2 className="mt-3 font-display text-5xl text-[#a8703f] drop-shadow-[0_3px_0_#fff]">Order sent!</h2>
          <p className="mt-4 font-semibold">
            Thank you, {sent.name}! We&apos;ve got your order <b>{sent.no}</b> and will reach out on{" "}
            <b>{sent.phone}</b> shortly.
          </p>
          <p className="mt-2 text-sm">We appreciate your support ♡</p>
          <button
            onClick={() => setCheckout(false)}
            className="mt-6 rounded-full bg-sky px-8 py-3 font-bold uppercase tracking-wide text-white shadow-lg transition hover:scale-105 active:scale-95"
          >
            Back to the shop
          </button>
        </div>
      </Frame>
    );
  }

  /* ---------- receipt form ---------- */
  return (
    <Frame>
      <header className="relative text-center">
        <div className="absolute left-0 top-2 hidden -rotate-6 rounded-md border border-[#d9bd9c] bg-white px-3 py-2 text-xs font-bold leading-tight text-[#4a2c1a] shadow-sm sm:block">
          <span className="absolute -top-2 left-2 h-3 w-10 bg-[#ead3b8]" />
          ♡<br />made<br />with love
        </div>
        <div className="absolute right-8 top-0 hidden text-5xl sm:block">🌷</div>

        <h2 className="font-display text-6xl text-[#a8703f] drop-shadow-[0_3px_0_#fff] sm:text-7xl">Receipt</h2>
        <p className="font-display text-2xl text-[#a8703f]">Thank you so much!</p>
        <p className="mt-2 inline-block bg-[#c98b54] px-6 py-1 text-xs font-semibold text-white [clip-path:polygon(0_0,100%_0,96%_50%,100%_100%,0_100%,4%_50%)] sm:text-sm">
          for supporting our small business ♡
        </p>
      </header>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Box label="Receipt No.">{meta.no}</Box>
        <Box label="Date">{meta.date}</Box>
      </div>

      <label className="mt-3 flex items-center gap-2 rounded-2xl border border-[#d9bd9c] bg-[#fff9f5] px-4 py-3">
        <Heart size={16} className="shrink-0 fill-[#a8703f] text-[#a8703f]" />
        <span className="whitespace-nowrap font-bold text-[#4a2c1a]">Customer Name :</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          className="min-w-0 flex-1 border-b border-dotted border-[#c4a07a] bg-transparent px-1 text-[#4a2c1a] outline-none placeholder:text-[#b8a08a]"
        />
      </label>

      <label className="mt-3 flex items-center gap-2 rounded-2xl border border-[#d9bd9c] bg-[#fff9f5] px-4 py-3">
        <Phone size={16} className="shrink-0 text-[#a8703f]" />
        <span className="whitespace-nowrap font-bold text-[#4a2c1a]">Phone :</span>
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="WhatsApp number"
          className="min-w-0 flex-1 border-b border-dotted border-[#c4a07a] bg-transparent px-1 text-[#4a2c1a] outline-none placeholder:text-[#b8a08a]"
        />
      </label>

      {/* items table */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-[#d9bd9c] bg-[#fff9f5] text-xs sm:text-sm">
        <div className={`grid ${COLS} bg-[#ead3b8] font-bold text-[#4a2c1a]`}>
          {["No.", "Item / Description", "Qty", "Price", "Amount"].map((h) => (
            <div key={h} className="px-1 py-2 text-center sm:px-2">
              {h}
            </div>
          ))}
        </div>

        {rows.map((r, i) => (
          <div
            key={i}
            className={`grid ${COLS} min-h-9 items-center border-t border-dashed border-[#d9bd9c] text-[#4a2c1a]`}
          >
            <div className="text-center">{r ? i + 1 : ""}</div>
            <div className="px-1.5 font-semibold leading-tight sm:px-2">{r?.item.name}</div>
            <div className="text-center">{r?.qty}</div>
            <div className="px-1 text-right">{r ? money(r.item.price) : ""}</div>
            <div className="px-1.5 text-right font-bold">{r ? money(r.qty * r.item.price) : ""}</div>
          </div>
        ))}

        <div className="flex justify-end border-t border-[#d9bd9c] text-[#4a2c1a]">
          <div className="bg-[#ead3b8] px-5 py-2 font-bold">Total</div>
          <div className="flex min-w-28 items-center justify-between gap-2 px-3 py-2 font-bold">
            {money(total)}
            <Heart size={14} className="fill-[#c98b54] text-[#c98b54]" />
          </div>
        </div>
      </div>

      {/* payment + notes */}
      <div className="mt-6 grid gap-5 sm:grid-cols-[0.9fr_1.1fr]">
        <div className="relative rounded-2xl border border-[#d9bd9c] bg-[#fff9f5] p-4 pt-5">
          <Tag>Payment Method</Tag>
          <div className="space-y-2.5">
            {PAYMENTS.map((p) => (
              <div key={p.label} className="flex items-center gap-2 text-[#4a2c1a]">
                <button
                  type="button"
                  aria-pressed={payment === p.label}
                  onClick={() => setPayment(payment === p.label ? "" : p.label)}
                  className="flex items-center gap-2 text-left font-semibold"
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded border-2 border-[#c4a07a] ${
                      payment === p.label ? "bg-[#a8703f] text-white" : "bg-white"
                    }`}
                  >
                    {payment === p.label && <Check size={12} strokeWidth={4} />}
                  </span>
                  {p.label}
                  {p.emoji && <span>{p.emoji}</span>}
                  {p.label === "Other" && <span>:</span>}
                </button>
                {p.label === "Other" && (
                  <input
                    value={other}
                    onChange={(e) => {
                      setOther(e.target.value);
                      setPayment("Other");
                    }}
                    aria-label="Other payment method"
                    className="min-w-0 flex-1 border-b border-dotted border-[#c4a07a] bg-transparent px-1 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl border border-[#d9bd9c] bg-[#fff9f5] p-4 pt-5">
          <Tag>Notes</Tag>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Delivery address, flavours, special requests..."
            className="ruled w-full resize-none bg-transparent text-[#4a2c1a] outline-none placeholder:text-[#b8a08a]"
          />
        </div>
      </div>

      {/* spam trap: hidden from people, bots fill it in */}
      <input
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honey}
        onChange={(e) => setHoney(e.target.value)}
        name="website"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="mt-6 flex items-center justify-center gap-3 text-center">
        <span className="text-3xl">☕</span>
        <div>
          <p className="font-display text-3xl text-[#a8703f]">Thank you!</p>
          <p className="text-sm font-semibold text-[#4a2c1a]">We appreciate your support ♡</p>
        </div>
        <span className="text-3xl">🌸</span>
      </div>

      {error && <p className="mt-5 text-center text-sm font-bold text-[#b42318]">{error}</p>}

      <button
        onClick={placeOrder}
        disabled={status === "sending"}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-sky py-3.5 font-bold uppercase tracking-wide text-white shadow-lg transition hover:scale-[1.02] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Send size={20} /> {status === "sending" ? "Sending your order..." : "Place order"}
      </button>

      <button
        onClick={() => {
          setCheckout(false);
          setOpen(true);
        }}
        className="mx-auto mt-4 block text-sm font-bold text-[#9a5f33] underline underline-offset-4"
      >
        Edit my basket
      </button>
    </Frame>
  );
}

export default function CheckoutModal() {
  const { checkout } = useCart();
  return checkout ? <Receipt /> : null;
}