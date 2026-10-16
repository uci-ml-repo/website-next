/// <reference path="../.sst/platform/config.d.ts" />

const bucket = new sst.aws.Bucket("Bucket", {
  access: "cloudfront",
});

// Donation archives stay private, including after submission to review.
const datasetUploads = new sst.aws.Bucket("DatasetUploads", {
  cors: {
    allowOrigins: ["*"],
    allowMethods: ["PUT"],
    allowHeaders: ["content-type"],
  },
  lifecycle: [{ id: "expire-incomplete-uploads", prefix: "temporary/", expiresIn: "1 day" }],
});

export { bucket, datasetUploads };
