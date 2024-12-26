import { type PrismaClient } from "@prisma/client";
import fs from "fs-extra";

import { datasetZip } from "@/lib/utils";

function datasetStaticFilesAbsolute({ id }: { id: number }) {
  return `${process.env.STATIC_FILES_ROOT}/${id}`;
}

function datasetZipAbsolute({ id, slug }: { id: number; slug: string }) {
  return `${datasetStaticFilesAbsolute({ id })}/${slug}.zip`;
}

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
