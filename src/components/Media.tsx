import Image from "next/image";
import type { CSSProperties } from "react";

type Props = {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  style?: CSSProperties;
};

export default function Media({ src, alt, width, height, className = "", priority, style }: Props) {
  const ext = src.split(".").pop()?.toLowerCase();

  if (ext === "mp4" || ext === "webm" || ext === "mov") {
    return (
      <video
        src={src}
        width={width}
        height={height}
        className={className}
        style={style}
        aria-label={alt}
        autoPlay
        loop
        muted
        playsInline
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
      unoptimized={ext === "gif"}
    />
  );
}