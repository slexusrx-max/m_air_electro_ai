import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./helpers.mjs";
import { renderToStaticMarkup } from "react-dom/server";

const config = (env = {}) => load("lib/site.ts", {}, { process: { env } });

test("active public domain addresses do not activate outbound delivery or the contact form", () => {
  const site = config();
  assert.equal(site.siteConfig.publicEmailAddresses.contact, "contact@mairelectroai.com");
  assert.equal(site.siteConfig.ownerContactEmail, undefined);
  assert.equal(site.siteConfig.contactEmail, undefined);
  assert.equal(site.verifiedMailbox(site.siteConfig.publicEmailAddresses.contact), undefined);
  const contact = load("lib/contact.ts", { "./site": site }, { process: { env: { CONTACT_FORM_ENABLED: "true" } } });
  assert.equal(contact.contactReady(), false);
});

test("verified individual publisher cannot be replaced by a stale company environment value", () => {
  const site = config({ NEXT_PUBLIC_OPERATOR_NAME: "Old company placeholder" });
  assert.equal(site.siteConfig.operatorName, "Stanislav Zavizion");
  assert.equal(site.siteConfig.operatingCountry, "Romania");
  assert.equal(site.siteConfig.commercialRegion, "Romania / European Union");
  assert.equal(site.siteConfig.publisherStatus, "Individual / independent publisher");
  for (const field of ["editorName", "editorBio", "editorExpertise", "publisherProfile"]) assert.equal(site.siteConfig[field], undefined);
  const editorial = load("lib/editorial.ts", { "./site": site, "./marketplace/editorial-records.json": { default: {} } });
  assert.equal(editorial.editorialAuthor({}), undefined);
  assert.equal(editorial.editorialAuthor({ author: "owner" }), "Stanislav Zavizion");
  assert.equal(editorial.editorialAuthor(editorial.editorialRecord("/learn/how-to-size-backup-battery")), undefined);
});

test("all three operational addresses retain explicit environment and verification gates", () => {
  const site = config({ CONTACT_EMAIL_VERIFIED: "true" });
  assert.deepEqual(JSON.parse(JSON.stringify(site.publicEmailAddresses)), {
    contact: "contact@mairelectroai.com", partnerships: "partnerships@mairelectroai.com", privacy: "privacy@mairelectroai.com",
  });
  const emails = { NEXT_PUBLIC_CONTACT_EMAIL: site.publicEmailAddresses.contact, NEXT_PUBLIC_PARTNERSHIPS_EMAIL: site.publicEmailAddresses.partnerships, NEXT_PUBLIC_PRIVACY_EMAIL: site.publicEmailAddresses.privacy };
  for (const state of [site, config({ ...emails, CONTACT_EMAIL_VERIFIED: "false" })]) {
    for (const field of ["contactEmail", "partnershipsEmail", "privacyEmail"]) assert.equal(state.siteConfig[field], undefined);
  }
  assert.equal(config({ ...emails, CONTACT_EMAIL_VERIFIED: "true" }).siteConfig.privacyEmail, emails.NEXT_PUBLIC_PRIVACY_EMAIL);
  const inboundOnly = { ...emails, CONTACT_EMAIL_VERIFIED: "true" };
  const contact = load("lib/contact.ts", { "./site": config(inboundOnly) }, { process: { env: inboundOnly } });
  assert.equal(contact.contactReady(), false, "verified inbound routing must never activate the website form");
});

test("publisher presentation uses the domain contact and omits unsupported reviewer fields", () => {
  const site = config();
  const { PublisherDetails } = load("components/publisher-details.tsx", { "@/lib/site": site });
  for (const ro of [true, false]) {
    const html = renderToStaticMarkup(PublisherDetails({ ro }));
    assert.match(html, /mailto:contact@mairelectroai\.com/);
    assert.match(html, /Stanislav Zavizion/);
    assert.doesNotMatch(html, /gmail\.com|owner confirmation required|necesită confirmarea proprietarului|Responsible content reviewer|Responsabil de verificarea conținutului/);
  }
});

test("editorial sources stay visible without fabricated bylines or review dates", () => {
  const site = config();
  const records = { "/recorded": { author: "Named contributor", published: "2026-09-01", reviewed: "2026-09-02" } };
  const editorial = load("lib/editorial.ts", { "./site": site, "./marketplace/editorial-records.json": { default: records } });
  const { EditorialRecord } = load("components/editorial-record.tsx", { "@/lib/site": site, "@/lib/editorial": editorial });
  const missing = renderToStaticMarkup(EditorialRecord({ path: "/unattributed", title: "Source-based guide", ro: false, sources: ["https://example.org/manual"] }));
  assert.match(missing, /https:\/\/example\.org\/manual/);
  assert.match(missing, /Source-based desk research/);
  assert.doesNotMatch(missing, /Unconfirmed|require confirmation|"author"|"dateModified"|"datePublished"/);
  const recorded = renderToStaticMarkup(EditorialRecord({ path: "/recorded", title: "Recorded guide", ro: false }));
  assert.match(recorded, /Named contributor/);
  assert.match(recorded, /Human review.*2026-09-02/);
});

test("structured data separates Person, Brand and WebSite without invented identity or authorship", () => {
  const site = config();
  const graph = site.websiteStructuredData()["@graph"];
  assert.equal(graph[0]["@type"], "Person");
  assert.equal(graph[0].name, "Stanislav Zavizion");
  assert.equal(graph[1]["@type"], "Brand");
  assert.equal(graph[1].name, "M Air Electro AI");
  assert.equal(graph[2].publisher["@id"], graph[0]["@id"]);
  assert.equal(graph[0].brand["@id"], graph[1]["@id"]);
  assert.doesNotMatch(JSON.stringify(graph), /Organization|Corporation|address|vatID|taxID|legalName|employee|hasCredential|email|jobTitle/);
  const { ProductStructuredData } = load("components/marketplace/structured-data.tsx", { "@/lib/site": site });
  const article = ProductStructuredData({ product: { kind: "equipment-class", name: "Equipment class", description: "Description", category: "solar-panels", slug: "class" } }).props.data;
  assert.equal(article.publisher.name, "Stanislav Zavizion");
  assert.equal(article.publisher["@type"], "Person");
  assert.equal(article.author, undefined);
});
