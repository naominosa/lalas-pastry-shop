import SafeImage from "./SafeImage";
import { BUSINESS_NAME, LOGO_SRC } from "@/data/config";

export default function Logo({
  className = "",
  size = "nav",
}: {
  className?: string;
  size?: "nav" | "footer";
}) {
  // Change these heights to make the logo bigger or smaller
  const height = size === "footer" ? "h-24 sm:h-32" : "h-16 sm:h-20";

  return (
    <SafeImage
      src= "/images/logo.png"
      alt={BUSINESS_NAME}
      width={600}
      height={240}
      className={`${height} w-auto max-w-[50vw]   object-contain shadow-lg sm:max-w-none`}
      fallback={<span className={`font-display tracking-wide ${className}`}>{BUSINESS_NAME}</span>}
    />
  );
}