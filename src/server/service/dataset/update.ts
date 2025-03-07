import { eq, sql } from "drizzle-orm";
import fs from "fs-extra";

import { db } from "@/db";
import { dataset } from "@/db/schema";
import {
  DATASET_FILES_UNZIPPED_PATH,
  DATASET_FILES_ZIP_PATH,
} from "@/lib/routes";
import { absoluteStaticPath } from "@/lib/utils/file";
import { service } from "@/server/service";

export class DatasetUpdateService {
  async zipStats(input: { id: number; slug: string; status: string }) {
    const zipStats = await service.file.read.zipStats({
      absolutePath: absoluteStaticPath(DATASET_FILES_ZIP_PATH(input)),
    });

    await db
      .update(dataset)
      .set({
        fileCount: zipStats.fileCount,
        size: zipStats.size,
      })
      .where(eq(dataset.id, input.id));

    return zipStats;
  }

  async title({
    datasetId,
    title,
    isExternal,
  }: {
    datasetId: number;
    title: string;
    isExternal: boolean;
  }) {
    const existingDataset = await service.dataset.find.byId(datasetId);
    const newSlug = await service.dataset.create.getSlug(title);

    if (!isExternal) {
      const oldZipPath = absoluteStaticPath(
        DATASET_FILES_ZIP_PATH(existingDataset),
      );

      const newZipPath = absoluteStaticPath(
        DATASET_FILES_ZIP_PATH({ ...existingDataset, slug: newSlug }),
      );

      if (fs.existsSync(oldZipPath)) {
        fs.moveSync(oldZipPath, newZipPath, { overwrite: true });
      }

      const oldUnzippedPath = absoluteStaticPath(
        DATASET_FILES_UNZIPPED_PATH(existingDataset),
      );

      const newUnzippedPath = absoluteStaticPath(
        DATASET_FILES_UNZIPPED_PATH({ ...existingDataset, slug: newSlug }),
      );

      if (fs.existsSync(oldUnzippedPath)) {
        fs.moveSync(oldUnzippedPath, newUnzippedPath, { overwrite: true });
      }
    }

    const [updatedDataset] = await db
      .update(dataset)
      .set({ title, slug: newSlug })
      .where(eq(dataset.id, datasetId))
      .returning();

    return updatedDataset;
  }

  async refreshView(id?: number) {
    await db.execute(sql`
      SELECT
        refresh_dataset_view (${id})
    `);
  }
}
