import Link from "next/link";

import { PlatformShell } from "@/components/platform-shell";
import { SectionHeading } from "@/components/section-heading";
import { StatusPill } from "@/components/status-pill";
import {
  liquidGlassButtonClassName,
  liquidGlassPrimaryButtonClassName,
  moduleCardClassName,
} from "@/components/ui/glass";

const primaryModules = [
  {
    title: "AI Assistant",
    href: "/assistant",
    description:
      "Electrical reasoning, structured next steps, and provider-ready AI architecture for diagnostics-first workflows.",
  },
  {
    title: "Diagnostics",
    href: "/diagnostics",
    description:
      "Symptom-led troubleshooting flows for residential, industrial, marine, and offshore electrical systems.",
  },
  {
    title: "Calculators",
    href: "/calculators",
    description:
      "Eight deterministic engineering tools for sizing, protection, transformer, generator, and battery planning.",
  },
  {
    title: "Documents AI",
    href: "/documents",
    description:
      "Architecture-ready document analysis for manuals, schematics, drawings, evidence packages, and PDFs.",
  },
];

const trustLayers = [
  "Verified experts instead of anonymous low-trust listings.",
  "Protected marketplace workflow with deposit, completion confirmation, and dispute window.",
  "Electrical and electrical-equipment focus only, with no drift into generic handyman categories.",
  "Premium marine and industrial vertical for higher-complexity systems and remote support cases.",
];

const launchTracks = [
  {
    title: "US Home Electrical",
    body: "Panels, breakers, outlets, switches, lighting, EV chargers, generators, and appliance electrical faults.",
  },
  {
    title: "Electrical & Electronic Parts",
    body: "Control boards, sensors, drives, breakers, relays, PLC modules, motors, and verified refurbished spares.",
  },
  {
    title: "Marine & Industrial",
    body: "DP, PMS, switchboards, thrusters, drives, automation, document analysis, and remote diagnostic escalation.",
  },
];

export default function Home() {
  return (
    <PlatformShell prioritizeBackground contentClassName="flex-1 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <section className="min-h-[calc(100vh-11rem)] content-center">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-lime-100/82">
              AI diagnostics - verified experts - protected electrical marketplace
            </div>
            <h1 className="hero-title mt-6 max-w-5xl text-4xl font-semibold leading-[0.98] tracking-tight text-white [text-shadow:0_16px_38px_rgba(0,0,0,0.32),0_0_28px_rgba(255,255,255,0.1)] sm:text-5xl lg:text-7xl">
              The premium operating layer for electrical diagnostics, engineering tools, and trusted execution.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/84 sm:text-xl">
              M Air Electro AI combines AI-first electrical diagnostics, deterministic calculators,
              technical document intelligence, verified specialists, and protected marketplace
              workflows for real electrical work.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/assistant" className={`${liquidGlassPrimaryButtonClassName} px-5 py-3 text-sm font-semibold`}>
                Open AI Assistant
              </Link>
              <Link href="/calculators" className={`${liquidGlassButtonClassName} px-5 py-3 text-sm font-semibold`}>
                Use calculators
              </Link>
              <Link href="/marketplace" className={`${liquidGlassButtonClassName} px-5 py-3 text-sm font-semibold`}>
                Explore marketplace
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {["Electrical only", "US market first", "Marine premium", "Protected payouts"].map((item) => (
                <StatusPill key={item} label={item} />
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Core Modules"
            title="One product surface, four operating layers."
            description="The MVP ties together diagnosis, calculation, documentation, and trusted transaction workflows without pretending these are separate products."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {primaryModules.map((module, index) => (
              <Link
                key={module.href}
                href={module.href}
                className={`${moduleCardClassName} transition duration-300 hover:-translate-y-1 hover:border-lime-100/30 hover:shadow-[0_18px_40px_rgba(0,0,0,0.22),0_0_24px_rgba(163,230,53,0.16)]`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lime-100/78">
                  0{index + 1}
                </p>
                <h2 className="mt-4 text-xl font-semibold text-white">{module.title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/78">{module.description}</p>
                <p className="mt-6 text-sm font-semibold text-lime-100/92">Open module</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <SectionHeading
              eyebrow="Positioning"
              title="Not a handyman marketplace. Not a generic AI wrapper."
              description="The product focus is deliberately narrow: electrical services, electrical diagnostics, electrical parts, and premium marine and industrial expertise."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {trustLayers.map((item) => (
              <article key={item} className={moduleCardClassName}>
                <p className="text-sm leading-7 text-white/78">{item}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          <SectionHeading
            eyebrow="Launch Tracks"
            title="Go narrow enough to win trust, broad enough to matter."
            description="The launch surface is organized around electrical demand that is high-friction, evidence-heavy, and too specialized for low-trust marketplaces."
          />
          <div className="grid gap-4 lg:grid-cols-3">
            {launchTracks.map((track) => (
              <article key={track.title} className={moduleCardClassName}>
                <h2 className="text-xl font-semibold text-white">{track.title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/78">{track.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </PlatformShell>
  );
}
