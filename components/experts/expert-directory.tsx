"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { ExpertProfile } from "@/lib/experts";

type ExpertCategory = "all" | "residential" | "industrial" | "marine";

const categories: Array<{ id: ExpertCategory; label: string }> = [
  { id: "all", label: "All experts" },
  { id: "residential", label: "Residential" },
  { id: "industrial", label: "Industrial" },
  { id: "marine", label: "Marine & Offshore" },
];

const profileCategory: Record<string, Exclude<ExpertCategory, "all">> = {
  "residential-diagnostics-specialist": "residential",
  "industrial-controls-and-drives-engineer": "industrial",
  "marine-and-offshore-electro-technical-expert": "marine",
};

function profileSearchText(profile: ExpertProfile) {
  return [
    profile.title,
    profile.description,
    ...profile.audience,
    ...profile.serviceModes,
    ...profile.signals,
    ...profile.useCases,
  ]
    .join(" ")
    .toLocaleLowerCase();
}

export function ExpertDirectory({ profiles }: { profiles: ExpertProfile[] }) {
  const [activeCategory, setActiveCategory] = useState<ExpertCategory>("all");
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleProfiles = useMemo(
    () =>
      profiles.filter((profile) => {
        const categoryMatches = activeCategory === "all" || profileCategory[profile.slug] === activeCategory;
        return categoryMatches && (!normalizedQuery || profileSearchText(profile).includes(normalizedQuery));
      }),
    [activeCategory, normalizedQuery, profiles],
  );

  return (
    <section aria-label="Expert directory" className="space-y-7">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Expert Profiles</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          Verified electrical experts, on demand
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Find a specialist for residential, industrial, marine, and offshore electrical systems.
        </p>
        <label className="relative mx-auto mt-6 block max-w-xl text-left">
          <span className="sr-only">Search experts by specialty</span>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-teal-700">
            <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
            <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by specialty: EV charger, PLC, VFD..."
            className="w-full rounded-2xl border border-teal-950/15 bg-white/80 py-3 pl-11 pr-4 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-500/15"
          />
        </label>
      </div>

      <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-slate-600" aria-label="Verification highlights">
        <li>✓ Verification evidence displayed</li>
        <li>✓ Specialist tracks by electrical vertical</li>
        <li>✓ Response expectations are visible</li>
      </ul>

      <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Expert categories">
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`shrink-0 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
              activeCategory === category.id
                ? "border-teal-700 bg-teal-700 text-white shadow-sm"
                : "border-teal-950/15 bg-white/70 text-slate-700 hover:border-teal-600 hover:text-teal-800"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3" role="tabpanel">
        {visibleProfiles.map((profile) => (
          <article key={profile.slug} className="info-card flex h-full flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-bold ${profile.premium ? "bg-lime-100 text-lime-800" : "bg-teal-100 text-teal-800"}`}>
                  {profile.premium ? "Priority track" : "Verified track"}
                </span>
                <h2 className="mt-4 text-xl font-bold text-slate-950">{profile.title}</h2>
              </div>
              <span className="shrink-0 rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">Verified</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{profile.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.useCases.slice(0, 3).map((useCase) => (
                <span key={useCase} className="rounded-lg border border-teal-950/10 bg-teal-50/70 px-2.5 py-1 text-xs text-slate-700">
                  {useCase}
                </span>
              ))}
            </div>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-y border-teal-950/10 py-4 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Response</dt>
                <dd className="mt-1 font-semibold text-slate-800">{profile.responseWindow}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Coverage</dt>
                <dd className="mt-1 font-semibold text-slate-800">{profile.regions.join(" · ")}</dd>
              </div>
            </dl>
            <p className="mt-4 text-sm text-slate-600">
              For <strong className="font-semibold text-slate-800">{profile.audience.join(", ")}</strong>
            </p>
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <Link href={`/experts/${profile.slug}`} className="button-primary">
                View profile
              </Link>
              <Link href="/contact" className="button-outline">
                Request access
              </Link>
            </div>
          </article>
        ))}
      </div>

      {visibleProfiles.length === 0 ? (
        <div className="info-card text-center">
          <h2>No matching expert track</h2>
          <p>Try a broader specialty or choose another category.</p>
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["1", "Describe your issue", "Add symptoms, photos, diagrams, or alarm logs."],
          ["2", "Match with an expert", "Choose a verified track for the technical context."],
          ["3", "Get the next step", "Receive a clear diagnostic or escalation path."],
        ].map(([number, title, description]) => (
          <article key={number} className="info-card text-center">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-sm font-bold text-teal-800">{number}</span>
            <h2 className="mt-3">{title}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>
    </section>
  );
}
