import { defineConfig, globalIgnores } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

import reactConfig from "./eslint.config.react.js";

export default defineConfig([
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...reactConfig,
  globalIgnores([
    "node_modules/**",
    ".next/**",
    ".open-next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);
