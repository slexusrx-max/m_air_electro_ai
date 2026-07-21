import { glassPanelClassName, moduleCardClassName } from "@/components/ui/glass";

type CalculatorFieldProps = {
  children: React.ReactNode;
  label: string;
};

type CalculatorNumberInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "className" | "type">;
type CalculatorSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">{children}</div>;
}

export function CalculatorFormPanel({ children }: { children: React.ReactNode }) {
  return <section className={`${glassPanelClassName} p-6 sm:p-8`}>{children}</section>;
}

export function CalculatorResultsPanel({ children }: { children: React.ReactNode }) {
  return <section className="grid content-start gap-4">{children}</section>;
}

export function CalculatorGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

export function CalculatorField({ label, children }: CalculatorFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/84">{label}</span>
      {children}
    </label>
  );
}

export function CalculatorNumberInput(props: CalculatorNumberInputProps) {
  return (
    <input
      {...props}
      type="number"
      className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
    />
  );
}

export function CalculatorSelect(props: CalculatorSelectProps) {
  return (
    <select
      {...props}
      className="w-full rounded-2xl border border-white/18 bg-slate-950/45 px-4 py-3 text-sm text-white outline-none transition focus:border-lime-100/60 focus:ring-2 focus:ring-lime-100/20"
    />
  );
}

export function CalculatorAssumptions({ children, title = "Assumptions used by this MVP calculator" }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="mt-6 rounded-[1.5rem] border border-lime-100/16 bg-lime-100/[0.06] p-4 text-sm leading-7 text-white/78">
      <p className="font-semibold text-lime-50">{title}</p>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function CalculatorResultCard({
  label,
  value,
  detail,
}: {
  detail: string;
  label: string;
  value: string;
}) {
  return (
    <article className={moduleCardClassName}>
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-lime-100/75">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-3 text-sm leading-7 text-white/72">{detail}</p>
    </article>
  );
}

export function CalculatorValidationCard({ message }: { message: string }) {
  return (
    <article className={`${glassPanelClassName} p-6`}>
      <p className="text-sm font-semibold uppercase tracking-[0.26em] text-amber-200/80">Validation</p>
      <p className="mt-4 text-base leading-8 text-white/82">{message}</p>
    </article>
  );
}
