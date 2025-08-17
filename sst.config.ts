/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "mlrepo",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: { aws: { region: "us-east-1" } },
    };
  },
  async run() {
    const email = sst.aws.Email.get("Email", "uci-ics-mlr-prod.aws.uci.edu");

    const vpc = new sst.aws.Vpc("Vpc", { bastion: true, nat: "ec2" });

    const rds = new sst.aws.Postgres("Database", {
      vpc,
      proxy: true,
      dev: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        port: Number(process.env.DB_PORT),
      },
    });

    new sst.x.DevCommand("Studio", {
      link: [rds],
      dev: {
        command: "npx drizzle-kit studio",
        directory: "packages/db",
        autostart: false,
      },
    });

    const bucket = new sst.aws.Bucket("Bucket", {
      access: "cloudfront",
    });

    const router = new sst.aws.Router("Router");
    router.routeBucket("/files", bucket);

    const googleClientId = new sst.Secret("GOOGLE_CLIENT_ID");
    const googleClientSecret = new sst.Secret("GOOGLE_CLIENT_SECRET");
    const githubClientId = new sst.Secret("GITHUB_CLIENT_ID");
    const githubClientSecret = new sst.Secret("GITHUB_CLIENT_SECRET");
    const authSecret = new sst.Secret("AUTH_SECRET");

    const secrets = [
      googleClientId,
      googleClientSecret,
      githubClientId,
      githubClientSecret,
      authSecret,
    ];

    new sst.aws.Nextjs("Website", {
      path: "apps/website",
      link: [rds, email, bucket, ...secrets],
      vpc,
      environment: { NEXT_PUBLIC_CDN_URL: router.url },
    });
  },
});
