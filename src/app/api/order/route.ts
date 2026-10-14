import { NextResponse } from "next/server";

import { products, money } from "@/data/menu";
// import { donuts, drinks, money } from "@/data/menu";
import { BUSINESS_NAME } from "@/data/config";

type Entry = { name: string; price: number };

// Prices come from the server's own menu, never from the browser
const catalog = new Map<string, Entry>(
  products.map((p): [string, Entry] => [p.id, { name: p.name, price: p.price }])
);

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const line = (v: unknown, max: number) => clean(v, max).replace(/\s+/g, " ");
const fail = (error: string, status = 400) => NextResponse.json({ error }, { status });

async function sendEmail(subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_EMAIL_TO;
  if (!key || !to) return false; // not set up

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.ORDER_EMAIL_FROM || `${BUSINESS_NAME} Orders <onboarding@resend.dev>`,
      to: [to],
      subject,
      text,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Email failed (${res.status}): ${await res.text()}`);
  return true;
}

async function sendWhatsApp(text: string): Promise<boolean> {
  const phone = process.env.CALLMEBOT_PHONE;
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!phone || !apikey) return false; // not set up

  const url =
    `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}` +
    `&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  const reply = (await res.text()).slice(0, 300);
  console.log("CallMeBot reply:", res.status, reply);
  if (!res.ok || /error|invalid/i.test(reply)) {
    throw new Error(`WhatsApp failed (${res.status}): ${reply}`);
  }
  return true;
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return fail("Invalid request.");

  // Honeypot: a hidden field real people never fill in
  if (clean(body.website, 50)) return NextResponse.json({ ok: true });

  const name = line(body.name, 80);
  const phone = line(body.phone, 30);
  const payment = line(body.payment, 60);
  const no = line(body.receiptNo, 30);
  const date = line(body.date, 30);
  const notes = clean(body.notes, 500);

  if (!name) return fail("Please add your name.");
  if (phone.replace(/\D/g, "").length < 7) return fail("Please add a valid phone number.");

  const rows = Array.isArray(body.items) ? body.items.slice(0, 40) : [];
  const lines: (Entry & { qty: number })[] = [];
  for (const row of rows) {
    const r = row as { id?: unknown; qty?: unknown };
    const found = catalog.get(clean(r.id, 40));
    const qty = Math.floor(Number(r.qty));
    if (!found || !Number.isFinite(qty) || qty < 1) continue;
    lines.push({ ...found, qty: Math.min(qty, 50) });
  }
  if (lines.length === 0) return fail("Your basket is empty.");

  const total = lines.reduce((n, l) => n + l.qty * l.price, 0);

  const text = [
    `🍩 New order - ${BUSINESS_NAME}`,
    "",
    `Receipt No.: ${no || "-"}`,
    `Date: ${date || "-"}`,
    "",
    `Customer: ${name}`,
    `Phone: ${phone}`,
    "",
    ...lines.map((l, i) => `${i + 1}. ${l.name} - ${l.qty} x ${money(l.price)} = ${money(l.qty * l.price)}`),
    "",
    `TOTAL: ${money(total)}`,
    `Payment: ${payment || "Not chosen"}`,
    ...(notes ? ["", `Notes: ${notes}`] : []),
  ].join("\n");

  const subject = `New order ${no} - ${name} - ${money(total)}`;

  const results = await Promise.allSettled([sendEmail(subject, text), sendWhatsApp(text)]);
  results.forEach((r) => {
    if (r.status === "rejected") console.error("Order notification failed:", r.reason);
  });

  const delivered = results.some((r) => r.status === "fulfilled" && r.value);
  if (!delivered) {
    const notConfigured = results.every((r) => r.status === "fulfilled" && !r.value);
    return notConfigured
      ? fail("Ordering isn't set up yet. Please contact the shop directly.", 500)
      : fail("We couldn't send your order right now. Please try again in a moment.", 502);
  }

  return NextResponse.json({ ok: true });
}