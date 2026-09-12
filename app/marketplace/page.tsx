import Link from "next/link";
import { PlatformShell } from "@/components/platform-shell";
import { AffiliateDisclosure } from "@/components/marketplace/affiliate-disclosure";
import { ProductCard } from "@/components/marketplace/product-card";
import { catalog, marketplaceCategories } from "@/lib/affiliate/catalog";
import { buildMetadata } from "@/lib/metadata";
import { getRequestDictionary } from "@/lib/i18n/request";
import { commercialCopy } from "@/lib/marketplace/copy";
export const metadata = buildMetadata({
  title: "Baterii, invertoare și echipamente solare pentru România",
  description:
    "Compară echipamente și ghiduri pentru energie de rezervă. Calcule transparente și legături către furnizori externi din UE.",
  path: "/marketplace",
});
export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{
    batteryKwh?: string;
    inverterKw?: string;
    surgeKw?: string;
    region?: string;
  }>;
}) {
  const q = await searchParams,
    t = await getRequestDictionary(),
    c = commercialCopy(t);
  const raw = [q.batteryKwh, q.inverterKw, q.surgeKw],
    supplied = raw.some((v) => v !== undefined);
  const values = raw.map((v) => Number(v));
  const valid =
    supplied &&
    raw.every((v) => typeof v === "string" && v.trim() !== "") &&
    values.every((v) => Number.isFinite(v) && v > 0 && v <= 100000) &&
    values[2] >= values[1] &&
    (!q.region || ["RO", "EU"].includes(q.region));
  return (
    <PlatformShell>
      <main className="mx-auto max-w-6xl space-y-10">
        <section className="brand-glass-card rounded-3xl p-7 sm:p-10">
          <p className="eyebrow">România · UE</p>
          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            {c.ro
              ? "Echipamente alese pornind de la necesar."
              : "Equipment choices start with your needs."}
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8">{c.productIntro}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="button-primary"
              href="/marketplace/find-my-solution"
            >
              {c.finder}
            </Link>
            <a className="button-outline" href="#products">
              {c.browse}
            </a>
          </div>
        </section>
        {supplied ? (
          <section
            data-testid="marketplace-requirements"
            className="info-card"
            aria-label={c.ro ? "Necesar primit" : "Received requirements"}
          >
            <h2>
              {valid
                ? c.ro
                  ? "Necesarul tău a fost preluat"
                  : "Your requirements were received"
                : c.ro
                  ? "Verifică valorile din calcul"
                  : "Check your calculation values"}
            </h2>
            {valid ? (
              <>
                <p>
                  {c.ro ? "Regiune" : "Region"}: {q.region ?? "RO"} ·{" "}
                  {c.ro ? "Baterie nominală" : "Nominal battery"}:{" "}
                  {values[0].toLocaleString(c.locale)} kWh ·{" "}
                  {c.ro ? "Invertor continuu" : "Continuous inverter"}:{" "}
                  {values[1].toLocaleString(c.locale)} kW ·{" "}
                  {c.ro ? "Vârf" : "Surge"}:{" "}
                  {values[2].toLocaleString(c.locale)} kW
                </p>
                <p>
                  {c.ro
                    ? "Aceste valori sunt criterii de comparare, nu confirmări că fiecare produs de mai jos le îndeplinește. Pentru o baterie, compară energia întregului banc; pentru un invertor, verifică și durata vârfului."
                    : "These are comparison criteria, not confirmation that every product below meets them. Compare total bank energy for batteries and surge duration for inverters."}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    className="button-outline"
                    href="/marketplace/category/lithium-batteries"
                  >
                    {c.ro ? "Compară baterii" : "Compare batteries"}
                  </Link>
                  <Link
                    className="button-outline"
                    href="/marketplace/category/inverters"
                  >
                    {c.ro ? "Compară invertoare" : "Compare inverters"}
                  </Link>
                </div>
              </>
            ) : (
              <Link href="/backup-calculator" className="button-outline mt-3">
                {c.backup}
              </Link>
            )}
          </section>
        ) : null}
        <AffiliateDisclosure dictionary={t} />
        <section>
          <h2 className="text-3xl font-bold">{c.categories}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {marketplaceCategories
              .filter((x) => x.primary)
              .map((cat) => (
                <Link
                  key={cat.slug}
                  className="brand-glass-card rounded-2xl p-5"
                  href={`/marketplace/category/${cat.slug}`}
                >
                  <h3 className="font-bold">{c.ro ? cat.name : cat.nameEn}</h3>
                  <p className="mt-3 text-sm leading-6">
                    {c.ro ? cat.summary : cat.summaryEn}
                  </p>
                </Link>
              ))}
          </div>
        </section>
        <section id="products">
          <h2 className="text-3xl font-bold">{c.products}</h2>
          <p className="mt-3 max-w-3xl leading-7">
            {c.ro
              ? "Începe cu rolul componentei. Verifică tensiunea, puterea, capacitatea și limitele înainte de cumpărare. Nu publicăm prețuri sau stocuri neverificate."
              : "Start with the component’s role. Check voltage, power, capacity and limits before buying. We do not publish unverified prices or stock."}
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {catalog
              .filter((p) => p.featured)
              .map((p) => (
                <ProductCard key={p.id} product={p} dictionary={t} />
              ))}
          </div>
        </section>
      </main>
    </PlatformShell>
  );
}
