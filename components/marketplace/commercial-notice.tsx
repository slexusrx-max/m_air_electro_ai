import Link from "next/link";

export function CommercialNotice({ ro }: { ro: boolean }) {
  return (
    <aside className="commercial-notice" data-testid="affiliate-disclosure-before-content" aria-label={ro ? "Transparență comercială" : "Commercial disclosure"}>
      <span className="commercial-notice-label">{ro ? "TRANSPARENȚĂ" : "TRANSPARENCY"}</span>
      <p>{ro
        ? "M Air Electro AI este partener afiliat independent Renogy și Waterdrop Germany, nu dealer. Linkurile marcate ca afiliate pot genera un comision pentru achiziții eligibile, fără cost suplimentar pentru tine. Linkurile obișnuite nemarcate nu au urmărire afiliată."
        : "M Air Electro AI is an independent Renogy and Waterdrop Germany affiliate partner, not a dealer. Marked affiliate links may earn us a commission on qualifying purchases at no additional cost to you. Ordinary unmarked supplier links are not affiliate tracked."} <Link href="/affiliate-disclosure">{ro ? "Detalii" : "Details"} →</Link></p>
    </aside>
  );
}
