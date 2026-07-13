import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent text-slate-800">
      <div className="flex min-h-screen flex-col">
        <header className="rounded-full border border-slate-200/70 bg-white/70 px-4 py-3 shadow-sm backdrop-blur md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#7ed8c5] text-sm font-semibold text-slate-900">
                MA
              </div>
              <span className="text-lg font-semibold tracking-tight text-slate-900">
                M Air Electro AI
              </span>
            </div>

            <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
              {[
                "AI Assistant",
                "Diagnostics",
                "Documents",
                "Calculators",
              ].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="transition hover:text-slate-900"
                >
                  {item}
                </a>
              ))}
            </nav>

            <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700">
              Sign In
            </button>
          </div>
        </header>

        <main className="flex-1">
          <section className="w-full">
            <Image
              src="/hero.png"
              alt="M Air Electro AI hero"
              width={1600}
              height={900}
              priority
              className="h-auto w-full object-contain opacity-100"
            />
          </section>
        </main>
      </div>
    </div>
  );
}
