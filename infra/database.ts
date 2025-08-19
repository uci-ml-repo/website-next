/// <reference path="../.sst/platform/config.d.ts" />

const vpc = new sst.aws.Vpc("Vpc", { bastion: true, nat: "ec2" });

const database = new sst.aws.Postgres("Database", {
  vpc,
  proxy: true,
  version: "17.6",
  dev: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: Number(process.env.DB_PORT),
  },
});

new sst.x.DevCommand("Studio", {
  link: [database],
  dev: {
    command: "npx drizzle-kit studio",
    directory: "packages/db",
    autostart: false,
  },
});

export { vpc, database };
