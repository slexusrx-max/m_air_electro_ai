import { siteConfig } from "@/lib/site";

export function PublisherDetails({ ro }: { ro: boolean }) {
  const unknown = ro ? "Nepublicat — necesită confirmarea proprietarului" : "Not published — owner confirmation required";
  return <section className="content-panel">
    <h2>{ro ? "Responsabilitate editorială" : "Editorial responsibility"}</h2>
    <dl className="publisher-details">
      <dt>{ro ? "Operator" : "Operator"}</dt><dd>{siteConfig.operatorName || unknown}</dd>
      <dt>{ro ? "Editor responsabil" : "Responsible editor"}</dt><dd>{siteConfig.editorName || unknown}</dd>
      <dt>{ro ? "Biografie verificabilă" : "Verifiable biography"}</dt><dd>{siteConfig.editorBio || unknown}</dd>
      <dt>{ro ? "Competențe declarate" : "Declared expertise"}</dt><dd>{siteConfig.editorExpertise || unknown}</dd>
    </dl>
    {siteConfig.publisherProfile && <p><a href={siteConfig.publisherProfile} rel="noreferrer" target="_blank">{ro ? "Profil profesional" : "Professional profile"} ↗</a></p>}
    <p>{ro ? "Editorul identificat trebuie să aprobe materialele și corecțiile. Un câmp necompletat nu reprezintă o calificare sau o verificare finalizată." : "The named editor must approve material and corrections. An incomplete field is not a qualification or a completed review."}</p>
  </section>;
}
