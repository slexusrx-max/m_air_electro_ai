import { PlatformShell } from "@/components/platform-shell";
import { Intro } from "@/components/marketplace/shared";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
import { categoryPhotos } from "@/lib/marketplace/category-photos";

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
