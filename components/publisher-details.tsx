import { siteConfig } from "@/lib/site";

export function PublisherDetails({ ro }: { ro: boolean }) {
  const contactEmail = siteConfig.contactEmail ?? siteConfig.publicEmailAddresses.contact;
  return <section className="content-panel">
    <h2>{ro ? "Despre editor" : "About the publisher"}</h2>
    <p>{ro ? `${siteConfig.name} este marca și platforma publicată de ${siteConfig.operatorName}, persoană fizică și editor independent. În prezent, nu există o companie înregistrată în spatele site-ului.` : `${siteConfig.name} is the brand and platform published by ${siteConfig.operatorName}, an individual and independent publisher. There is currently no incorporated company behind the website.`}</p>
    <dl className="publisher-details">
      <dt>{ro ? "Marcă / platformă" : "Brand / platform"}</dt><dd>{siteConfig.name}</dd>
      <dt>{ro ? "Proprietar / editor al platformei" : "Owner / publisher"}</dt><dd>{siteConfig.operatorName}</dd>
      <dt>{ro ? "Email de contact" : "Contact email"}</dt><dd><a className="break-all underline" href={`mailto:${contactEmail}`}>{contactEmail}</a></dd>
      <dt>{ro ? "Țara de operare" : "Operating country"}</dt><dd>{ro ? "România" : siteConfig.operatingCountry}</dd>
      <dt>{ro ? "Regiune comercială" : "Commercial region"}</dt><dd>{ro ? "România / Uniunea Europeană" : siteConfig.commercialRegion}</dd>
      <dt>{ro ? "Statut" : "Status"}</dt><dd>{ro ? "Persoană fizică / editor independent" : siteConfig.publisherStatus}</dd>
      {siteConfig.editorName && <><dt>{ro ? "Responsabil de verificarea conținutului" : "Responsible content reviewer"}</dt><dd>{siteConfig.editorName}</dd></>}
      {siteConfig.editorBio && <><dt>{ro ? "Biografie" : "Biography"}</dt><dd>{siteConfig.editorBio}</dd></>}
      {siteConfig.editorExpertise && <><dt>{ro ? "Competențe declarate" : "Declared expertise"}</dt><dd>{siteConfig.editorExpertise}</dd></>}
    </dl>
    {siteConfig.publisherProfile && <p><a href={siteConfig.publisherProfile} rel="noreferrer" target="_blank">{ro ? "Profil profesional" : "Professional profile"} ↗</a></p>}
    <p>{ro ? "Publicăm ghiduri documentate și calcule cu ipoteze explicite pentru alegerea echipamentelor. Sursele și metodologia însoțesc materialele; proiectarea și verificarea instalației revin unui profesionist calificat." : "We publish source-based guides and calculations with explicit assumptions to support equipment selection. Sources and methodology accompany the content; installation design and verification require a qualified professional."}</p>
  </section>;
}
