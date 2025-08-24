import { S3Client } from "@aws-sdk/client-s3";

import { fileFindService } from "@/server/service/file/find";
import { fileReadService } from "@/server/service/file/read";

export const s3 = new S3Client({ region: process.env.AWS_REGION });

export const fileService = {
  find: fileFindService,
  read: fileReadService,
};
