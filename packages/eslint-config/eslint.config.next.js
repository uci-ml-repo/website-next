import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

import reactConfig from "./eslint.config.react.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const config = [...compat.extends("next/core-web-vitals", "next/typescript"), ...reactConfig];

export default config;
