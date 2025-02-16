// @ts-check

/** @type {import('prettier').Config} */
const prettierConfig = {
  endOfLine: "lf",
  tabWidth: 2,
  plugins: [
    "prettier-plugin-packagejson",
    "prettier-plugin-sql",
    "prettier-plugin-embed",
    "prettier-plugin-sh",
    "prettier-plugin-tailwindcss",
  ],
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

/** @type {import('prettier-plugin-tailwindcss').PluginOptions} */
const prettierPluginTailwindCssConfig = {
  tailwindFunctions: ["cva", "clsx", "cn"],
};

/** @type {import("prettier").Options} */
const config = {
  ...prettierConfig,
  ...prettierPluginEmbedConfig,
  ...prettierPluginSqlConfig,
  ...prettierPluginTailwindCssConfig,
};

export default config;
