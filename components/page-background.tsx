import Image from "next/image";

/** Reuses the original hero artwork as the lowest marketing-page layer. */
export function PageBackground() {
  return <div className="marketing-page-background pointer-events-none absolute inset-0 overflow-hidden"><Image src="/hero.png" alt="" fill priority sizes="100vw" className="object-cover"/><div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(234,247,247,.88),rgba(22,184,177,.34),rgba(243,251,251,.78))]"/></div>;
}
