import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";
const require = createRequire(import.meta.url);
function load(file, deps = {}, globals = {}) {
  const compiledModule = { exports: {} };
  const code = ts.transpileModule(
    readFileSync(new URL("../" + file, import.meta.url), "utf8"),
    {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText;
  vm.runInNewContext(code, {
    module: compiledModule,
    exports: compiledModule.exports,
    require: (name) => deps[name] ?? require(name),
    URL,
    Response,
    Request,
    AbortSignal,
    Error,
    process: { env: { OPENAI_MODEL: "test", OPENAI_API_KEY: "test" } },
    ...globals,
  });
  return compiledModule.exports;
}
const calc = load("lib/electrical-calculations.ts");
test("standard sizes reject unsupported requirements and preserve boundary values", () => {
  assert.equal(calc.getNextStandardValue([10, 20], 11), 20);
  assert.equal(calc.getNextStandardValue([10, 20], 20), 20);
  for (const value of [21, Infinity, NaN, 0, -1])
    assert.throws(() => calc.getNextStandardValue([10, 20], value));
});
test("large battery, breaker, fuse and generator demands never return an undersized rating", () => {
  const cases = [
    () =>
      calc.calculateBattery({
        loadPowerWatts: 5000,
        backupHours: 8,
        systemVoltage: 24,
        maxDepthOfDischargePercent: 80,
        inverterEfficiencyPercent: 92,
      }),
    () =>
      calc.calculateBreakerSelection({
        ambientDeratingPercent: 80,
        designCurrent: 3000,
        inrushMultiplier: 1,
        loadType: "continuous",
        spareMarginPercent: 20,
      }),
    () =>
      calc.calculateFuseSelection({
        designCurrent: 1600,
        spareMarginPercent: 20,
        continuousLoad: true,
        applicationType: "general-circuit",
      }),
    () =>
      calc.calculateGenerator({
        runningLoadKw: 3000,
        powerFactor: 0.8,
        reservePercent: 20,
        largestMotorKw: 30,
        startingMethod: "dol",
      }),
  ];
  for (const run of cases) {
    assert.throws(run);
    assert.match(calc.resolveCalculation(run).error, /supported range/);
  }
  const normal = calc.calculateBattery({
    loadPowerWatts: 1200,
    backupHours: 4,
    systemVoltage: 24,
    maxDepthOfDischargePercent: 80,
    inverterEfficiencyPercent: 92,
  });
  assert.ok(normal.recommendedBatteryAh >= normal.minimumNominalAh);
});
test("cable sizing rejects voltage-drop overflow and still handles ordinary loads", () => {
  assert.throws(() =>
    calc.calculateCableSizing({
      current: 100,
      length: 1000,
      material: "copper",
      maxVoltageDropPercent: 3,
      systemType: "dc",
      voltage: 48,
    }),
  );
  const result = calc.calculateCableSizing({
    current: 32,
    length: 45,
    material: "copper",
    maxVoltageDropPercent: 3,
    systemType: "three-phase",
    voltage: 400,
  });
  assert.ok(result.actualVoltageDropPercent <= 3);
  assert.ok(result.ampacityLimitAmps >= 32);
});
test("redirects accept local recovery paths and reject external URL variants", () => {
  const { safeRedirectUrl } = load("lib/safe-redirect.ts");
  for (const value of [
    "//example.org",
    "/\\example.org",
    "/\t/example.org",
    "https://example.org",
    "javascript:alert(1)",
    null,
  ]) {
    assert.equal(
      safeRedirectUrl(value, "https://app.example").href,
      "https://app.example/dashboard",
    );
  }
  assert.equal(
    safeRedirectUrl("/reset-password?ok=1", "https://app.example").href,
    "https://app.example/reset-password?ok=1",
  );
});
function ai(options = {}) {
  let calls = 0;
  const client = {
    auth: {
      getUser: async () => ({
        data: { user: options.anonymous ? null : { id: "user" } },
        error: null,
      }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => ({
            data: { account_status: options.status ?? "active" },
            error: options.profileError ?? null,
          }),
        }),
      }),
    }),
    rpc: async () => ({
      data: options.allowed ?? true,
      error: options.quotaError ?? null,
    }),
  };
  const route = load(
    "app/api/ai/route.ts",
    {
      "@/lib/server/ai": {
        getAiRuntimeStatus: () => ({
          preferredProvider: "openai",
          activeProviderConfigured: true,
        }),
      },
      "@/lib/supabase/server": { createActionClient: async () => client },
    },
    {
      fetch: async () => {
        calls++;
        if (options.networkError) throw new Error("offline");
        return Response.json(
          options.output ?? {
            output: [
              { type: "reasoning" },
              {
                type: "message",
                content: [
                  { type: "output_text", text: "First" },
                  { type: "output_text", text: "Second" },
                ],
              },
            ],
          },
          { status: options.providerStatus ?? 200 },
        );
      },
    },
  );
  return {
    send: (body = { prompt: "Test" }) =>
      route.POST(
        new Request("http://localhost/api/ai", {
          method: "POST",
          body: JSON.stringify(body),
        }),
      ),
    calls: () => calls,
  };
}
test("AI parses raw Responses output, including refusal text", async () => {
  const normal = ai();
  const r = await normal.send();
  assert.equal(r.status, 200);
  assert.equal((await r.json()).answer, "First\nSecond");
  const refusal = ai({
    output: {
      output: [
        {
          type: "message",
          content: [{ type: "refusal", refusal: "Cannot assist" }],
        },
      ],
    },
  });
  assert.equal((await (await refusal.send()).json()).answer, "Cannot assist");
});
test("AI prevents unauthenticated, blocked, quota-exhausted and unverified requests from calling the provider", async () => {
  for (const [options, status] of [
    [{ anonymous: true }, 401],
    [{ status: "blocked" }, 403],
    [{ status: "pending" }, 403],
    [{ allowed: false }, 429],
    [{ quotaError: {} }, 503],
    [{ profileError: {} }, 503],
  ]) {
    const app = ai(options);
    assert.equal((await app.send()).status, status);
    assert.equal(app.calls(), 0);
  }
});
test("AI validates input and reports empty or failed provider responses", async () => {
  for (const body of [
    { prompt: "" },
    { prompt: "x".repeat(6001) },
    { prompt: "Test", mode: "x".repeat(101) },
  ]) {
    const app = ai();
    assert.equal((await app.send(body)).status, 400);
    assert.equal(app.calls(), 0);
  }
  for (const options of [
    { output: { output: [] } },
    { networkError: true },
    { providerStatus: 429 },
  ])
    assert.equal((await ai(options).send()).status, 502);
});
test("backup calculator retains editable inputs and suppresses equipment links when the rating is unsupported", () => {
  const react = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const { BackupCalculator } = load(
    "components/product/backup-calculator.tsx",
    {
      react: {
        ...react,
        useState: (initial) => [
          Array.isArray(initial)
            ? initial.map((load) => ({ ...load, watts: 100000, enabled: true }))
            : initial,
          () => {},
        ],
      },
      "@/lib/marketplace/planning": load("lib/marketplace/planning.ts"),
      "@/lib/marketplace/copy": load("lib/marketplace/copy.ts"),
      "@/lib/electrical-calculations.ts": calc,
      "@/lib/electrical-calculations": calc,
      "next/link": {
        default: ({ children, ...props }) =>
          react.createElement("a", props, children),
      },
    },
  );
  const html = renderToStaticMarkup(
    react.createElement(BackupCalculator, { dictionary: {} }),
  );
  assert.match(html, /role="alert"/);
  assert.match(html, /<input/);
  assert.doesNotMatch(html, /Find matching equipment/);
});
