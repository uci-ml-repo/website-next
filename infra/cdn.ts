/// <reference path="../.sst/platform/config.d.ts" />

const bucket = new sst.aws.Bucket("Bucket", {
  access: "cloudfront",
});

const bucketRouter = new sst.aws.Router("BucketRouter");
bucketRouter.routeBucket("/", bucket);

export { bucketRouter };
