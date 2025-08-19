/// <reference path="../.sst/platform/config.d.ts" />

const email = sst.aws.Email.get("Email", "uci-ics-mlr-prod.aws.uci.edu");

export { email };
