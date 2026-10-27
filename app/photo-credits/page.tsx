import { PlatformShell } from "@/components/platform-shell";
import { Intro } from "@/components/marketplace/shared";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
import { categoryPhotos } from "@/lib/marketplace/category-photos";
import reviewedRenogy from "@/data/renogy-reviewed-products.json";
import bluettiPhotos from "@/data/bluetti-reviewed-photos.json";
import pecronPhotos from "@/data/pecron-reviewed-photos.json";
import pecronExpansion from "@/data/pecron-reviewed-expansion.json";

export async function generateMetadata() {
  const locale = await getRequestLocale();
  return buildMetadata({ locale, path: "/photo-credits", title: locale === "ro" ? "Surse și licențe foto" : "Photo sources and licences", description: locale === "ro" ? "Sursele fotografiilor de categorii și condițiile de reutilizare." : "Category photo sources and reuse conditions." });
}
export default async function Page() {
  const locale = await getRequestLocale();
  const ro = locale === "ro";
  return <PlatformShell><main className="commerce-page">
    <Intro title={ro ? "Surse și licențe foto" : "Photo sources and licences"}
      description={ro ? "Fotografiile de categorie arată exemple de echipamente. Nu confirmă modelul, disponibilitatea sau compatibilitatea unui produs din catalog." : "Category photos show examples of equipment. They do not confirm the model, availability or compatibility of a catalog product."} />
    <section className="content-panel">
      <h2>{ro ? "Fotografii ale modelelor Renogy" : "Renogy model photographs"}</h2>
      <p>{ro ? "Fotografiile de mai jos provin din resursele oficiale ale producătorului pentru promovarea produselor în programul afiliat. Sunt afișate fără modificarea imaginii, de pe CDN-ul producătorului. Drepturile aparțin titularilor; nu acordăm o licență generală de reutilizare." : "These photographs come from the manufacturer's official resources for product promotion in the affiliate program. They are displayed unchanged from the manufacturer's CDN. Rights remain with their holders; we do not grant a general reuse licence."}</p>
      <ul>{reviewedRenogy.map(p => <li key={p.id}><a href={p.url} target="_blank" rel="noopener noreferrer">{p.officialName} — {p.option}</a></li>)}</ul>
    </section>
    <section className="content-panel">
      <h2>{ro ? "Fotografii ale stațiilor PECRON și BLUETTI" : "PECRON and BLUETTI station photographs"}</h2>
      <p>{ro ? "Imagini originale de pe paginile oficiale UE ale modelelor indicate, afișate fără modificarea produsului. Drepturile aparțin titularilor. Indicarea sursei nu acordă o licență generală de reutilizare și nu confirmă statutul de partener autorizat." : "Original images from the indicated models' official EU pages, displayed without altering the product. Rights remain with their holders. Source attribution does not grant a general reuse licence or confirm authorized partner status."}</p>
      <ul>{[...pecronPhotos, ...bluettiPhotos].map(p => <li key={p.id}><a href={p.sourceUrl} target="_blank" rel="noopener noreferrer">{p.id.toUpperCase().replaceAll("-", " ")}</a></li>)}</ul>
      <ul>{pecronExpansion.map(p => <li key={p.id}><a href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a></li>)}</ul>
    </section>
    {Object.entries(categoryPhotos).map(([category, photo]) => <section className="content-panel" key={category}>
      <h2>{photo.subject[ro ? "ro" : "en"]}</h2><p>{photo.credit}</p>
      <p><a href={photo.source} target="_blank" rel="noopener noreferrer">{ro ? "Sursa fotografiei" : "Photo source"} ↗</a></p>
      {photo.license ? <>
        <p><a href={photo.license.url} target="_blank" rel="noopener noreferrer">{photo.license.name} ↗</a></p>
        <p>{ro ? "Adaptare pentru web: redimensionare, decupare și compresie. Copia adaptată păstrează licența indicată. Autorul nu susține platforma sau produsele promovate." : "Adapted for the web: resizing, cropping and compression. The adapted copy retains the stated licence. The photographer does not endorse this platform or promoted products."}</p>
      </> : <p>{ro ? "Material furnizat prin catalogul afiliat al producătorului în Impact pentru promovarea echipamentului respectiv. Nu acordăm o licență generală de reutilizare." : "Material supplied through the manufacturer's Impact affiliate catalog for promotion of the corresponding equipment. We do not grant a general reuse licence."}</p>}
    </section>)}
  </main></PlatformShell>;
}
