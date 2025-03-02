import { eq } from "drizzle-orm";
import path from "path";

import { db } from "@/db";
import { dataset } from "@/db/schema";
import { DATASET_FILES_ZIP_PATH } from "@/lib/routes";
import { service } from "@/server/service";

export class DatasetUpdateService {
  async zipStats(input: { id: number; slug: string; status: string }) {
    if (!process.env.STATIC_FILES_DIRECTORY) {
      throw new Error("STATIC_FILES_DIRECTORY is not set");
    }

    const zipStats = await service.file.read.zipStats({
      absolutePath: path.join(
        process.env.STATIC_FILES_DIRECTORY,
        DATASET_FILES_ZIP_PATH(input),
      ),
    });

    return db
      .update(dataset)
      .set({
        fileCount: zipStats.fileCount,
        size: zipStats.size,
      })
      .where(eq(dataset.id, input.id));
  }
}
