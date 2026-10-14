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
  const height = size === "footer" ? "h-28 sm:h-40" : "h-20 sm:h-28";

  return (
    <SafeImage
      src={LOGO_SRC}
      alt={BUSINESS_NAME}
      width={800}
      height={320}
      className={`logo-pop ${height} w-auto max-w-[55vw] object-contain sm:max-w-none`}
      fallback={<span className={`font-display tracking-wide ${className}`}>{BUSINESS_NAME}</span>}
    />
  );
}