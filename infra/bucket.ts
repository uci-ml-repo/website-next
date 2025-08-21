/// <reference path="../.sst/platform/config.d.ts" />

const bucket = new sst.aws.Bucket("Bucket", {
  access: "cloudfront",
});

export { bucket };
