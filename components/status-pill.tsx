type StatusPillProps = {
  label: string;
  tone?: "neutral" | "success" | "warning";
};

const toneClassNames: Record<NonNullable<StatusPillProps["tone"]>, string> = {
  neutral: "border-white/16 bg-white/[0.06] text-white/72",
  success: "border-lime-200/24 bg-lime-100/[0.08] text-lime-50",
  warning: "border-amber-200/24 bg-amber-100/[0.08] text-amber-50",
};

export function StatusPill({ label, tone = "neutral" }: StatusPillProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.26em] ${toneClassNames[tone]}`}
    >
      {label}
    </span>
  );
}
