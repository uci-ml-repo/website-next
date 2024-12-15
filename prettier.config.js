// @ts-check

/**
 * @type {import("prettier").Options}
 */
const config = {
  endOfLine: "lf",
  tabWidth: 2,
  plugins: [
    "prettier-plugin-packagejson",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-prisma",
  ],
  tailwindFunctions: ["cva", "clsx", "cn"],
};

export default config;
