import type { Config } from "prettier";
import type { PluginEmbedOptions as PluginEmbedConfig } from "prettier-plugin-embed";
import type { SqlBaseOptions as PluginSqlConfig } from "prettier-plugin-sql";
import type { PluginOptions as PluginTailwindCssConfig } from "prettier-plugin-tailwindcss";

const prettierConfig: Config = {
  endOfLine: "lf",
  tabWidth: 2,
  printWidth: 100,
  plugins: [
    "prettier-plugin-packagejson",
    "prettier-plugin-sql",
    "prettier-plugin-embed",
    "prettier-plugin-sh",
    "prettier-plugin-tailwindcss",
  ],
};

const prettierPluginEmbedConfig: PluginEmbedConfig = {
  embeddedSqlTags: ["sql"],
};

const prettierPluginSqlConfig: PluginSqlConfig = {
  language: "postgresql",
  keywordCase: "upper",
  dataTypeCase: "upper",
  functionCase: "upper",
};

const prettierPluginTailwindCssConfig: PluginTailwindCssConfig = {
  tailwindFunctions: ["cva", "clsx", "cn"],
};

const config = {
  ...prettierConfig,
  ...prettierPluginEmbedConfig,
  ...prettierPluginSqlConfig,
  ...prettierPluginTailwindCssConfig,
};

export default config;
