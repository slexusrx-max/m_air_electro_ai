import { test, expect } from "@playwright/test";
import { build } from "esbuild";
import { readFileSync } from "node:fs";

test("isolated contact form validates, reports failure and provider acceptance without external requests", async ({ page }) => {
  const result = await build({ stdin: { contents: `import React from 'react';import{createRoot}from'react-dom/client';import{ContactForm}from'./components/contact-form';createRoot(document.getElementById('root')).render(<ContactForm ro={false} enabled={true} siteKey="dummy"/>);`, resolveDir: process.cwd(), loader: "tsx" }, bundle: true, write: false, jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' }, plugins: [{ name: "contact-isolation", setup(b) {
    b.onResolve({ filter: /^next\/(link|script)$/ }, args => ({ path: args.path, namespace: "fixture" }));
    b.onLoad({ filter: /.*/, namespace: "fixture" }, args => ({ loader: "jsx", resolveDir: process.cwd(), contents: args.path === "next/link" ? `import React from'react';export default function Link(props){return <a {...props}/>}` : `export default function Script(){return null}` }));
  } }] });
  await page.setViewportSize({ width: 375, height: 900 });
  const requests: string[] = []; let succeeds = false;
  await page.route("**/*", route => {
    const url = route.request().url();
    if (url.endsWith("/contact-fixture")) return route.fulfill({ contentType: "text/html", body: `<html><head><style>${readFileSync("app/globals.css", "utf8").replace(/@import[^;]+;/g, "")}</style></head><body><main class="commerce-page" id="root"></main><script>${result.outputFiles[0].text.replace(/<\/script/gi,"<\\/script")}</script></body></html>` });
    requests.push(url);
    if (url.endsWith("/api/contact")) return route.fulfill({ status: succeeds ? 200 : 502, contentType: "application/json", body: JSON.stringify({ code: succeeds ? "accepted" : "failed" }) });
    return route.abort();
  });
  await page.goto("http://localhost:3100/contact-fixture");
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  expect(requests).toEqual([]);
  await page.getByLabel("Name", { exact: true }).fill("Fixture user");
  await page.getByLabel("Email", { exact: true }).fill("fixture@example.invalid");
  await page.getByLabel("Message (20–4000 characters)", { exact: true }).fill("This is a mock-only message, never delivered.");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Message not sent");
  succeeds = true;
  await page.getByRole("button", { name: "Send message", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("accepted for delivery");
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue("");
  expect(requests).toEqual(["http://localhost:3100/api/contact", "http://localhost:3100/api/contact"]);
});
