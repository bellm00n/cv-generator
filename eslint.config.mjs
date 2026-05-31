import nextConfig from "eslint-config-next/core-web-vitals";
import tsEslint from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";

const eslintConfig = [
  {
    ignores: [
      "src/generated/**",
      ".next/**",
      "test-results/**",
      "playwright-report/**",
      "playwright/.cache/**",
      "node_modules/**",
      "**/*.tsbuildinfo",
    ],
  },
  ...nextConfig,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      ...tsEslint.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...eslintConfigPrettier.rules,
      "prettier/prettier": "error",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
    },
  },
];

export default eslintConfig;
