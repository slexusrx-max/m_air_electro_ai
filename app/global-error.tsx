"use client";

import Link from "next/link";

import { liquidGlassButtonClassName, liquidGlassPrimaryButtonClassName } from "@/components/ui/glass";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function GlobalError({ error, unstable_retry }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#07101d] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/16 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04)),linear-gradient(180deg,rgba(7,16,29,0.62),rgba(7,16,29,0.26))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-100/78">Global error</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            The application shell failed to render.
          </h1>
          <p className="mt-5 text-base leading-8 text-white/76 sm:text-lg">
            Retry the application or return to the homepage once the runtime issue is resolved.
          </p>
          <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-7 text-white/62">
            {error.message}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={() => unstable_retry()} className={`${liquidGlassPrimaryButtonClassName} px-5 py-3 text-sm font-semibold`}>
              Retry
            </button>
            <Link href="/" className={`${liquidGlassButtonClassName} px-5 py-3 text-sm font-semibold`}>
              Back to homepage
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
