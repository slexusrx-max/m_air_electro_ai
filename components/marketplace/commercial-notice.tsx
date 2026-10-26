import Link from "@/components/localized-link";

export function CommercialNotice({ ro }: { ro: boolean }) {
  return (
    <aside className="commercial-notice" data-testid="affiliate-disclosure-before-content" aria-label={ro ? "Transparență comercială" : "Commercial disclosure"}>
      <p>{ro
        ? "Linkurile marcate ca afiliate pot genera comision; cele nemarcate nu au urmărire afiliată."
        : "Marked affiliate links may earn commission; unmarked links are not affiliate tracked."} <Link href="/affiliate-disclosure">{ro ? "Detalii" : "Details"} →</Link></p>
    </aside>
  );
}
