import defaultConfig from "./index.js";
import { FlatCompat } from "@eslint/eslintrc";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [...defaultConfig, ...compat.extends("next/core-web-vitals", "next/typescript")];

export default config;
