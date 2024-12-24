import { type PrismaClient } from "@prisma/client";
import fs from "fs-extra";

import { datasetZip, datasetZipAbsolute } from "@/lib/utils";

export default class FileFindService {
  constructor(readonly prisma: PrismaClient) {}

  async zipMetadata({ id, slug }: { id: number; slug: string }) {
    const path = datasetZip({ id: id, slug: slug });
    const absolutePath = datasetZipAbsolute({ id: id, slug: slug });
    const exists = await fs.pathExists(absolutePath);
    const size = exists ? (await fs.stat(absolutePath)).size : null;

    return {
      exists,
      path,
      size,
    };
  }
}
