// Loading and the resolved page can coexist while Next streams a response.
// Do not render the full shell here: duplicated navigation IDs break early focus.
export default function Loading() {
  return (
    <div
      className="mx-auto my-16 w-full max-w-5xl px-5"
      role="status"
      aria-live="polite"
    >
      <div className="info-card p-8">
        <p className="font-semibold">Se încarcă pagina…</p>
        <div
          className="mt-6 h-10 animate-pulse rounded-xl bg-teal-100"
          aria-hidden="true"
        />
        <div
          className="mt-4 h-40 animate-pulse rounded-xl bg-teal-50"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
