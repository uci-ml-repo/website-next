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
    const { bucket } = await import("./infra/bucket");
    const { secrets } = await import("./infra/secrets");
    const { router, domain } = await import("./infra/router");

    router.routeBucket(`cdn.${domain}`, bucket);

    const website = new sst.aws.Nextjs("Website", {
      path: "apps/website",
      link: [database, email, bucket, ...secrets],
      vpc,
      router: { instance: router },
      environment: {
        NEXT_PUBLIC_CDN_URL: `https://cdn.${domain}`,
      },
    });

    new sst.aws.Function("Api", {
      link: [database, website],
      vpc,
      url: { router: { instance: router, domain: `api.${domain}` } },
      handler: "apps/api/src/index.handler",
    });
  },
});
