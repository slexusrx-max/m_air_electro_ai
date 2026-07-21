import { PlatformShell } from "@/components/platform-shell";
import { glassPanelClassName } from "@/components/ui/glass";

export default function Loading() {
  return (
    <PlatformShell contentClassName="flex flex-1 items-center px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="mx-auto w-full max-w-5xl">
        <div className={`${glassPanelClassName} animate-pulse p-8 sm:p-10`}>
          <div className="h-4 w-36 rounded-full bg-white/10" />
          <div className="mt-6 h-10 w-full max-w-3xl rounded-2xl bg-white/10" />
          <div className="mt-4 h-5 w-full max-w-2xl rounded-2xl bg-white/10" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="h-36 rounded-[1.5rem] bg-white/8" />
            <div className="h-36 rounded-[1.5rem] bg-white/8" />
            <div className="h-36 rounded-[1.5rem] bg-white/8" />
          </div>
        </div>
      </section>
    </PlatformShell>
  );
}
