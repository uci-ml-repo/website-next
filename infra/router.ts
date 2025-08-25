/// <reference path="../.sst/platform/config.d.ts" />

const domain =
  $app.stage === "production"
    ? "uci-ics-mlr-prod.aws.uci.edu"
    : `${$app.stage}.dev.uci-ics-mlr-prod.aws.uci.edu`;

const devOptions = {
  domain: {
    name: domain,
    aliases: [`*.${domain}`],
  },
};

const prodOptions = {
  domain: {
    name: domain,
    cert: "arn:aws:acm:us-east-1:670056635866:certificate/19c18403-5441-4415-9148-9f28c31b5168",
    aliases: [`*.${domain}`, "archive-beta.ics.uci.edu", "*.archive-beta.ics.uci.edu"],
  },
};

const router = new sst.aws.Router("Router", $app.stage === "production" ? prodOptions : devOptions);

export { router, domain };
