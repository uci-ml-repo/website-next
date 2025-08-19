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
    const { email } = await import("./infra/email");
    const { vpc, database } = await import("./infra/database");
    const { bucketRouter } = await import("./infra/cdn");
    const { apiRouter } = await import("./infra/api-router");
    const { secrets } = await import("./infra/secrets");

    const website = new sst.aws.Nextjs("Website", {
      path: "apps/website",
      link: [database, email, ...secrets],
      vpc,
      environment: {
        NEXT_PUBLIC_CDN_URL: bucketRouter.url,
      },
    });

    new sst.aws.Function("Api", {
      link: [database, website],
      url: { router: { instance: apiRouter } },
      handler: "apps/api/src/index.handler",
    });
  },
});
