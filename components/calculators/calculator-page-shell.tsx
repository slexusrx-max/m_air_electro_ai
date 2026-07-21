import { PageHero } from "@/components/page-hero";
import { PlatformShell } from "@/components/platform-shell";

type CalculatorPageShellProps = {
  actions: Array<{
    href: string;
    label: string;
    variant?: "primary" | "secondary";
  }>;
  children: React.ReactNode;
  description: string;
  title: string;
};

export function CalculatorPageShell({
  title,
  description,
  actions,
  children,
}: CalculatorPageShellProps) {
  return (
    <PlatformShell>
      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8">
        <PageHero eyebrow="Working calculator" title={title} description={description} actions={actions} />
        {children}
      </section>
    </PlatformShell>
  );
}
