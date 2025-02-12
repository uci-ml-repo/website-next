// @ts-check

/** @type {import('prettier').Config} */
const prettierConfig = {
  endOfLine: "lf",
  tabWidth: 2,
  plugins: [
    "prettier-plugin-packagejson",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-sql",
    "prettier-plugin-embed",
    "prettier-plugin-sh",
  ],
  tailwindFunctions: ["cva", "clsx", "cn"],
};

/** @type {import('prettier-plugin-embed').PluginEmbedOptions} */
const prettierPluginEmbedConfig = {
  embeddedSqlTags: ["sql"],
};

/** @type {import('prettier-plugin-sql').SqlBaseOptions} */
const prettierPluginSqlConfig = {
  language: "postgresql",
  keywordCase: "upper",
  dataTypeCase: "upper",
  functionCase: "upper",
};

/** @type {import("prettier").Options} */
const config = {
  ...prettierConfig,
  ...prettierPluginEmbedConfig,
  ...prettierPluginSqlConfig,
};

export default config;
