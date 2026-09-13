import Image from "next/image";

/**
 * The selected green-energy wallpaper. It deliberately sits below every
 * route, while page content is rendered in the stacking context above it.
 */
export function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="marketing-page-background pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#f3fbfb]"
    >
      <Image
        src="/green-energy-hero.png"
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover saturate-110"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(234,247,247,.42),rgba(22,184,177,.16),rgba(243,251,251,.54))]" />
    </div>
  );
}
