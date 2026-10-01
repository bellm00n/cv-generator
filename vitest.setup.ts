import fc from "fast-check";

if (process.env.STRYKER_MUTATOR_WORKER !== undefined) {
  fc.configureGlobal({ seed: 42 });
}
