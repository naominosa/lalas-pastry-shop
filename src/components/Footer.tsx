import { Phone } from "lucide-react";
import { FaInstagram, FaWhatsapp } from "react-icons/fa6";
import Wave from "./Wave";
import Logo from "./Logo";
import { INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/data/config";

const socials = [
  { icon: FaInstagram, label: "Instagram", href: INSTAGRAM_URL },
  { icon: FaWhatsapp, label: "WhatsApp", href: `https://wa.me/${WHATSAPP_NUMBER}` },
];

export default function Footer() {
  return (
    <footer className="relative bg-mauve pb-10 pt-20">
      <Wave fillClass="fill-mauve" className="bottom-full translate-y-px" speed={20} />

      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 md:flex-row md:justify-between">
        {/* <Logo className="text-3xl text-sky" /> */}

        <Logo size="footer" className="text-3xl text-sky" />

        <div className="text-center text-white">
          <p className="text-xs font-bold uppercase tracking-wide">Follow us &amp; order on Instagram</p>
          <div className="mt-3 flex justify-center gap-6 text-3xl text-amber-200">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition hover:-translate-y-1"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <a href={`tel:+${WHATSAPP_NUMBER}`} className="flex items-center gap-2 text-white">
          <Phone size={16} />
          <span className="text-xs font-bold leading-tight">
            +{WHATSAPP_NUMBER}
            <br />
            <span className="opacity-80">call or WhatsApp to order</span>
          </span>
        </a>
      </div>
    </footer>
  );
}