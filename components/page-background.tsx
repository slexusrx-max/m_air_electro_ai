import Image from "next/image";

/**
 * Original Future Space energy artwork. It deliberately sits below every
 * route, while page content is rendered in the stacking context above it.
 */
export function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="marketing-page-background pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#f3fbfb]"
    >
      <Image
        src="/future-space-energy.png"
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover saturate-110"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(236,246,240,.7),rgba(236,246,240,.64),rgba(236,246,240,.76))]" />
    </div>
  );
}
