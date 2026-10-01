import { existsSync, globSync } from "node:fs";

const mutate = globSync("src/**/*.test.{ts,tsx}")
  .flatMap((testFile) => {
    const base = testFile.replace(/\.test\.tsx?$/, "");
    return [`${base}.ts`, `${base}.tsx`];
  })
  .filter((sourceFile) => existsSync(sourceFile));

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  packageManager: "npm",
  testRunner: "vitest",
  vitest: {
    configFile: "vitest.config.ts",
  },
  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",
  mutate,
  reporters: ["html", "clear-text", "progress"],
  htmlReporter: {
    fileName: "stryker-reports/mutation.html",
  },
  incremental: true,
  incrementalFile: "stryker-reports/stryker-incremental.json",
  thresholds: { high: 80, low: 60, break: null },
};

export default config;
