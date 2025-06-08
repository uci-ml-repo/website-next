const config = {
  endOfLine: "lf",
  tabWidth: 2,
  printWidth: 100,
  plugins: [
    "prettier-plugin-embed",
    "prettier-plugin-packagejson",
    "prettier-plugin-sh",
    "prettier-plugin-sql",
    "prettier-plugin-tailwindcss",
  ],

  // embed plugin
  embeddedSqlTags: ["sql"],

  // sql plugin
  language: "postgresql",
  keywordCase: "upper",
  dataTypeCase: "upper",
  functionCase: "upper",

  // tailwindcss plugin
  tailwindFunctions: ["cva", "clsx", "cn"],
};

export default config;
