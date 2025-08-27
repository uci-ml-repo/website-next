/// <reference path="../.sst/platform/config.d.ts" />

const vpc = new sst.aws.Vpc("Vpc", {
  bastion: true,
  nat: "ec2",
});

const database = new sst.aws.Postgres("Database", {
  vpc,
  proxy: true,
  version: "17.6",
  password: $dev ? undefined : new sst.Secret("PROD_DB_PASSWORD").value,
  dev: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: Number(process.env.DB_PORT),
  },
});

const migrator = new sst.aws.Function("DatabaseMigrator", {
  handler: "packages/db/migrator.handler",
  link: [database],
  vpc,
  copyFiles: [{ from: "packages/db/migrations", to: "./migrations" }],
  timeout: "5 minutes",
});

if (!$dev) {
  new aws.lambda.Invocation("DatabaseMigratorInvocation", {
    input: Date.now().toString(),
    functionName: migrator.name,
  });
}

new sst.x.DevCommand("Studio", {
  link: [database],
  dev: {
    command: "npx drizzle-kit studio",
    directory: "packages/db",
    autostart: false,
  },
});

export { vpc, database };
