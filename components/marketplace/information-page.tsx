import Link from "next/link";
import { PlatformShell } from "@/components/platform-shell";
import { Intro } from "./shared";
import { information } from "@/lib/marketplace/information";
import { local } from "@/lib/marketplace/content";
import { getRequestLocale } from "@/lib/i18n/request";
import { buildMetadata } from "@/lib/metadata";
export async function informationMetadata(slug:string){const locale=await getRequestLocale();const p=information[slug];return buildMetadata({title:local(p.title,locale),description:local(p.intro,locale),path:`/${slug}`});}
export async function InformationPage({slug}:{slug:string}){const locale=await getRequestLocale();const ro=locale==="ro";const p=information[slug];return <PlatformShell><main className="commerce-page"><Intro title={local(p.title,locale)} description={local(p.intro,locale)}/>{p.sections.map(s=><section className="content-panel" key={s.title.en}><h2>{local(s.title,locale)}</h2><p>{local(s.body,locale)}</p></section>)}<div className="action-row"><Link className="button-primary" href="/marketplace">Marketplace</Link><Link href={slug==="business"?"/solutions/business-backup":"/marketplace/find-my-solution"}>{ro?"Planifică sistemul":"Plan a system"} →</Link><Link href="/contact">Contact →</Link></div></main></PlatformShell>;}
