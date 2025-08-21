/// <reference path="../.sst/platform/config.d.ts" />

const domain =
  $app.stage === "production"
    ? "uci-ics-mlr-prod.aws.uci.edu"
    : `${$app.stage}.dev.uci-ics-mlr-prod.aws.uci.edu`;

const router = new sst.aws.Router("Router", {
  domain: {
    name: domain,
    aliases: [`*.${domain}`],
  },
});

export { router, domain };
