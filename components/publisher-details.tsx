import { siteConfig } from "@/lib/site";

export function PublisherDetails({ ro }: { ro: boolean }) {
  const unknown = ro ? "Nepublicat — necesită confirmarea proprietarului" : "Not published — owner confirmation required";
  return <section className="content-panel">
    <h2>{ro ? "Identitatea editorului și verificarea conținutului" : "Publisher identity and editorial review"}</h2>
    <p>{ro ? `${siteConfig.name} este marca și platforma publicată de ${siteConfig.operatorName}, persoană fizică și editor independent. În prezent, nu există o companie înregistrată în spatele site-ului.` : `${siteConfig.name} is the brand and platform published by ${siteConfig.operatorName}, an individual and independent publisher. There is currently no incorporated company behind the website.`}</p>
    <dl className="publisher-details">
      <dt>{ro ? "Marcă / platformă" : "Brand / platform"}</dt><dd>{siteConfig.name}</dd>
      <dt>{ro ? "Proprietar / editor al platformei" : "Owner / publisher"}</dt><dd>{siteConfig.operatorName}</dd>
      <dt>{ro ? "Țara de operare" : "Operating country"}</dt><dd>{ro ? "România" : siteConfig.operatingCountry}</dd>
      <dt>{ro ? "Regiune comercială" : "Commercial region"}</dt><dd>{ro ? "România / Uniunea Europeană" : siteConfig.commercialRegion}</dd>
      <dt>{ro ? "Statut" : "Status"}</dt><dd>{ro ? "Persoană fizică / editor independent" : siteConfig.publisherStatus}</dd>
      <dt>{ro ? "Responsabil de verificarea conținutului" : "Responsible content reviewer"}</dt><dd>{siteConfig.editorName || unknown}</dd>
      <dt>{ro ? "Biografie verificabilă" : "Verifiable biography"}</dt><dd>{siteConfig.editorBio || unknown}</dd>
      <dt>{ro ? "Competențe declarate" : "Declared expertise"}</dt><dd>{siteConfig.editorExpertise || unknown}</dd>
    </dl>
    {siteConfig.publisherProfile && <p><a href={siteConfig.publisherProfile} rel="noreferrer" target="_blank">{ro ? "Profil profesional" : "Professional profile"} ↗</a></p>}
    <p>{ro ? "Identitatea proprietarului nu confirmă o calificare tehnică sau verificarea umană a materialelor. Responsabilul de verificarea conținutului și aprobările articolelor trebuie confirmate separat; câmpurile necompletate nu reprezintă verificări finalizate." : "Owner identity does not establish technical qualifications or human review of the content. The responsible content reviewer and per-article approvals require separate confirmation; incomplete fields are not completed verifications."}</p>
  </section>;
}
