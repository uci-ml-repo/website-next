// @ts-check

/**
 * @type {import('pm2').StartOptions[]}
 */
module.exports = [
  {
    name: "website",
    script: "./build/index.js",
    node_args: "-r dotenv/config",
    autorestart: true,
  },
];
