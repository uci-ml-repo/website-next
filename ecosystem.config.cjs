// @ts-check

/**
 * @type {import('pm2').StartOptions[]}
 */
module.exports = [
  {
    name: "uci-ml-repo",
    script: "pnpm",
    args: "start",
    autorestart: true,
    env: {
      NODE_ENV: "production",
    },
  },
];
