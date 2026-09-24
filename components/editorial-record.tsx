import Link from "next/link";
import { editorialAuthor, editorialRecord } from "@/lib/editorial";
import { absoluteUrl, publisherStructuredData } from "@/lib/site";

export function EditorialRecord({ path, title, ro, sources = [], schema = true }: { path: string; title: string; ro: boolean; sources?: string[]; schema?: boolean }) {
  const record = editorialRecord(path), author = editorialAuthor(record);
  const json = { "@context": "https://schema.org", "@type": "TechArticle", headline: title, mainEntityOfPage: absoluteUrl(path), inLanguage: ro ? "ro" : "en",
    ...(author ? { author: { "@type": "Person", name: author } } : {}),
    ...(record.published ? { datePublished: record.published } : {}), ...(record.reviewed ? { dateModified: record.reviewed } : {}), citation: sources,
    publisher: publisherStructuredData(),
  };
  return <section className="editorial-record content-panel" aria-label={ro ? "Fișă editorială" : "Editorial record"}>
    {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }} />}
    <h2>{ro ? "Surse și metodologie" : "Sources and methodology"}</h2>
    {author && <p>{ro ? "Autor" : "Author"}: {author}</p>}
    {record.published && <p>{ro ? "Publicat" : "Published"}: {record.published}</p>}
    {record.reviewed && <p>{ro ? "Verificare umană" : "Human review"}: {record.reviewed}</p>}
    <p>{ro ? "Documentare pe baza surselor și calcule explicite; fără test practic pretins. Valorile lipsă rămân necunoscute. Compatibilitatea instalației necesită evaluare separată." : "Source-based desk research and explicit calculations; no hands-on testing claimed. Missing values remain unknown. Installation compatibility needs a separate assessment."}</p>
    {sources.length > 0 && <ul>{sources.map((url, i) => <li key={url}><a href={url} rel="noreferrer" target="_blank">{ro ? "Sursa" : "Source"} {i + 1} · {new URL(url).hostname} ↗</a></li>)}</ul>}
    <div className="action-row"><Link href="/methodology">{ro ? "Metodologie" : "Methodology"}</Link><Link href="/author-policy">{ro ? "Politica autorilor" : "Author policy"}</Link><Link href="/corrections-policy">{ro ? "Raportează o corecție" : "Report a correction"}</Link></div>
    {record.corrections?.map(c => <p key={c.date + c.reason}>{c.date}: {c.reason}</p>)}
  </section>;
}
