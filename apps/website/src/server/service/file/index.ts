import { S3Client } from "@aws-sdk/client-s3";

import { fileFindService } from "@/server/service/file/find";
import { fileReadService } from "@/server/service/file/read";
import { fileUploadService } from "@/server/service/file/upload";

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  // Browser uploads supply their body after signing; avoid signing an empty-body checksum.
  requestChecksumCalculation: "WHEN_REQUIRED",
});

export const fileService = {
  find: fileFindService,
  read: fileReadService,
  upload: fileUploadService,
};
