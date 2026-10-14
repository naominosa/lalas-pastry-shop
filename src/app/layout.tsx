import type { Metadata } from "next";
import { Playfair_Display, Fredoka } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { BUSINESS_NAME } from "@/data/config";
import "./globals.css";

// Headline font. I kept the old CSS variable name so no other file needs to change.
const display = Playfair_Display({ weight: ["600", "700"], subsets: ["latin"], variable: "--font-chewy" });
const fredoka = Fredoka({ subsets: ["latin"], variable: "--font-fredoka" });

export const metadata: Metadata = {
  title: `${BUSINESS_NAME} | Premium baked goods in Kaduna`,
  description:
    "Brownie pots, banana bread, stuffed cookies and gift boxes. Order online. Delivery within Kaduna and to Kano, Abuja, Jos & Lagos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${fredoka.variable} font-hand font-semibold antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}