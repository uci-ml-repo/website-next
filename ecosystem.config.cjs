// @ts-check

/**
 * @type {import('pm2').StartOptions[]}
 */
module.exports = [
  {
    name: "uci-ml-repo",
    script: "npm",
    args: "start",
    autorestart: true,
    env: {
      NODE_ENV: "production",
    },
  },
];
