import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";

import ts from "typescript";
const require = createRequire(import.meta.url);
export function load(file, deps = {}, globals = {}) {
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
