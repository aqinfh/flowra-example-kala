import Image from "next/image";

type PhotoProps = {
  src: string;
  alt: string;
  /** Intrinsic size when Flowra provides it; otherwise a fixed-aspect box with `fill` is used. */
  width?: number;
  height?: number;
  /** Aspect class for the fallback box, e.g. "aspect-[4/3]". */
  aspect?: string;
  sizes?: string;
  preload?: boolean;
  className?: string;
};

/** Flowra already resizes images, so Next's optimizer is skipped (`unoptimized`). */
export function Photo({ src, alt, width, height, aspect = "aspect-[4/3]", sizes, preload, className = "" }: PhotoProps) {
  if (width && height) {
    return (
      <Image
        src={src} alt={alt} width={width} height={height} sizes={sizes} preload={preload} unoptimized
        className={`h-auto w-full bg-rule ${className}`}
      />
    );
  }
  return (
    <div className={`relative w-full overflow-hidden bg-rule ${aspect} ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} preload={preload} unoptimized className="object-cover" />
    </div>
  );
}
