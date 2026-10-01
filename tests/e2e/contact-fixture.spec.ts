import { test, expect } from "@playwright/test";
import { build } from "esbuild";
import { readFileSync } from "node:fs";

test("isolated contact form validates, reports failure and provider acceptance without external requests", async ({ page }) => {
  const result = await build({ stdin: { contents: `import React from 'react';import{createRoot}from'react-dom/client';import{ContactForm}from'./components/contact-form';createRoot(document.getElementById('root')).render(<ContactForm ro={false} enabled={true} siteKey="dummy"/>);`, resolveDir: process.cwd(), loader: "tsx" }, bundle: true, write: false, jsx: "automatic", define: { "process.env.NODE_ENV": '"production"' }, plugins: [{ name: "contact-isolation", setup(b) {
    b.onResolve({ filter: /^next\/(link|script)$/ }, args => ({ path: args.path, namespace: "fixture" }));
    b.onLoad({ filter: /.*/, namespace: "fixture" }, args => ({ loader: "jsx", resolveDir: process.cwd(), contents: args.path === "next/link" ? `import React from'react';export default function Link(props){return <a {...props}/>}` : `import{useEffect}from'react';export default function Script({onReady}){useEffect(()=>{onReady()},[]);return null}` }));
  } }] });
  await page.setViewportSize({ width: 375, height: 900 });
  const requests: string[] = []; const tokens: string[] = []; let succeeds = false;
  await page.addInitScript(() => {
    // Isolated widget double only: no Cloudflare or SMTP request is possible.
    let sequence = 0;
    const widgets = new Map<string, HTMLElement>();
    (window as unknown as { turnstile: object }).turnstile = {
      render(node: HTMLElement, options: Record<string, (token?: string) => void>) {
        const id = `mock-${++sequence}`;
        widgets.set(id, node);
        node.dataset.widgetId = id;
        for (const [label, callback] of [["Mock success", "callback"], ["Mock expiry", "expired-callback"], ["Mock error", "error-callback"], ["Mock timeout", "timeout-callback"]]) {
          const button = document.createElement("button");
          button.type = "button"; button.textContent = label;
          button.onclick = () => options[callback](callback === "callback" ? id : undefined);
          node.appendChild(button);
        }
        return id;
      },
      remove(id: string) { widgets.get(id)?.replaceChildren(); widgets.delete(id); },
    };
  });
  await page.route("**/*", route => {
    const url = route.request().url();
    if (url.endsWith("/contact-fixture")) return route.fulfill({ contentType: "text/html", body: `<html><head><style>${readFileSync("app/globals.css", "utf8").replace(/@import[^;]+;/g, "")}</style></head><body><main class="commerce-page" id="root"></main><script>${result.outputFiles[0].text.replace(/<\/script/gi,"<\\/script")}</script></body></html>` });
    requests.push(url);
    if (url.endsWith("/api/contact")) {
      tokens.push(route.request().postDataJSON().token);
      return route.fulfill({ status: succeeds ? 200 : 502, contentType: "application/json", body: JSON.stringify({ code: succeeds ? "accepted" : "failed" }) });
    }
    return route.abort();
  });
  await page.goto("http://localhost:3100/contact-fixture");
  const submit = page.getByRole("button", { name: "Send message", exact: true });
  await expect(submit).toBeDisabled();
  expect(requests).toEqual([]);
  await page.getByLabel("Name", { exact: true }).fill("Fixture user");
  await page.getByLabel("Email", { exact: true }).fill("fixture@example.invalid");
  await page.getByLabel("Message (20–4000 characters)", { exact: true }).fill("This is a mock-only message, never delivered.");
  await page.getByRole("checkbox").check();
  // Enter/programmatic submission must also be guarded before a token exists.
  await page.locator("form").evaluate(form => (form as HTMLFormElement).requestSubmit());
  await expect(page.getByRole("status")).toContainText("Complete the spam check");
  expect(requests).toEqual([]);
  for (const event of ["Mock expiry", "Mock error", "Mock timeout"]) {
    await page.getByRole("button", { name: "Mock success", exact: true }).click();
    await expect(submit).toBeEnabled();
    await page.getByRole("button", { name: event, exact: true }).click();
    await expect(submit).toBeDisabled();
    await page.locator("form").evaluate(form => (form as HTMLFormElement).requestSubmit());
    expect(requests).toEqual([]);
  }
  await page.getByRole("button", { name: "Mock success", exact: true }).click();
  await submit.click();
  await expect(page.getByRole("status")).toContainText("Message not sent");
  await expect(submit).toBeDisabled();
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue("fixture@example.invalid");
  await expect(page.getByRole("button", { name: "Mock success", exact: true })).toHaveCount(1);
  succeeds = true;
  await page.getByRole("button", { name: "Mock success", exact: true }).click();
  await submit.click();
  await expect(page.getByRole("status")).toContainText("accepted for delivery");
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue("");
  await expect(submit).toBeDisabled();
  expect(tokens).toHaveLength(2);
  expect(tokens.every(Boolean)).toBe(true);
  expect(tokens[1]).not.toBe(tokens[0]);
  expect(requests).toEqual(["http://localhost:3100/api/contact", "http://localhost:3100/api/contact"]);
});
