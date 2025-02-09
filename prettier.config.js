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
  ],
  tailwindFunctions: ["cva", "clsx", "cn"],
};

/** @type {import('prettier-plugin-embed').PrettierPluginEmbedOptions} */
const prettierPluginEmbedConfig = {
  embeddedSqlTags: ["sql"],
};

/** @type {import('prettier-plugin-sql').SqlBaseOptions} */
const prettierPluginSqlConfig = {
  language: "postgresql",
  keywordCase: "upper",
};

/**
 * @type {import("prettier").Options}
 */
const config = {
  ...prettierConfig,
  ...prettierPluginEmbedConfig,
  ...prettierPluginSqlConfig,
};

export default config;
