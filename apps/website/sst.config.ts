/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "mlrepo-website",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        aws: {
          region: "us-east-1",
        },
      },
    };
  },
  async run() {
    const env = (await import("./env")).env;

    const email = sst.aws.Email.get("Email", "uci-ics-mlr-prod.aws.uci.edu");

    const vpc = new sst.aws.Vpc("Vpc", { bastion: true, nat: "ec2" });
    const rds = new sst.aws.Postgres("Database", {
      vpc,
      proxy: true,
      dev: {
        username: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        database: env.POSTGRES_DB,
        port: 5432,
      },
    });

    new sst.aws.Nextjs("Website", { link: [rds, email], vpc });
  },
});
