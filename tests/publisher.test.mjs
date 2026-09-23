import { test } from "node:test";
import assert from "node:assert/strict";
import { load } from "./helpers.mjs";

const config = (env = {}) => load("lib/site.ts", {}, { process: { env } });

test("owner-authorized public Gmail does not activate domain delivery or the contact form", () => {
  const site = config();
  assert.equal(site.siteConfig.ownerContactEmail, "slexusrx@gmail.com");
  assert.equal(site.siteConfig.contactEmail, undefined);
  assert.equal(site.verifiedMailbox(site.siteConfig.ownerContactEmail), undefined);
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

test("prepared official emails do not imply configured or verified mail delivery", () => {
  const site = config({ CONTACT_EMAIL_VERIFIED: "true" });
  assert.deepEqual(JSON.parse(JSON.stringify(site.plannedEmailAddresses)), {
    contact: "contact@mairelectroai.com", partnerships: "partnerships@mairelectroai.com", privacy: "privacy@mairelectroai.com",
  });
  const emails = { NEXT_PUBLIC_CONTACT_EMAIL: site.plannedEmailAddresses.contact, NEXT_PUBLIC_PARTNERSHIPS_EMAIL: site.plannedEmailAddresses.partnerships, NEXT_PUBLIC_PRIVACY_EMAIL: site.plannedEmailAddresses.privacy };
  for (const state of [site, config({ ...emails, CONTACT_EMAIL_VERIFIED: "false" })]) {
    for (const field of ["contactEmail", "partnershipsEmail", "privacyEmail"]) assert.equal(state.siteConfig[field], undefined);
  }
  assert.equal(config({ ...emails, CONTACT_EMAIL_VERIFIED: "true" }).siteConfig.privacyEmail, emails.NEXT_PUBLIC_PRIVACY_EMAIL);
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
