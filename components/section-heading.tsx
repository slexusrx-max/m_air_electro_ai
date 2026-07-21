type SectionHeadingProps = {
  description?: string;
  eyebrow: string;
  title: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-lime-100/80">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-white/70 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}
