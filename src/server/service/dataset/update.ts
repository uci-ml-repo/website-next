import { eq, sql } from "drizzle-orm";
import fs from "fs-extra";
import path from "path";

import { db } from "@/db";
import { dataset } from "@/db/schema";
import {
  DATASET_FILES_UNZIPPED_PATH,
  DATASET_FILES_ZIP_PATH,
} from "@/lib/routes";
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
    if (!process.env.STATIC_FILES_DIRECTORY) {
      throw new Error("STATIC_FILES_DIRECTORY is not defined");
    }

    const existingDataset = await service.dataset.find.byId(datasetId);
    const newSlug = await service.dataset.create.getSlug(title);

    if (!isExternal) {
      const oldZipPath = path.join(
        process.env.STATIC_FILES_DIRECTORY,
        DATASET_FILES_ZIP_PATH(existingDataset),
      );

      const newZipPath = path.join(
        process.env.STATIC_FILES_DIRECTORY,
        DATASET_FILES_ZIP_PATH({ ...existingDataset, slug: newSlug }),
      );

      if (fs.existsSync(oldZipPath)) {
        fs.moveSync(oldZipPath, newZipPath, { overwrite: true });
      }

      const oldUnzippedPath = path.join(
        process.env.STATIC_FILES_DIRECTORY,
        DATASET_FILES_UNZIPPED_PATH(existingDataset),
      );

      const newUnzippedPath = path.join(
        process.env.STATIC_FILES_DIRECTORY,
        DATASET_FILES_UNZIPPED_PATH({ ...existingDataset, slug: newSlug }),
      );

      if (fs.existsSync(oldUnzippedPath)) {
        fs.moveSync(oldUnzippedPath, newUnzippedPath, { overwrite: true });
      }
    }

    await db
      .update(dataset)
      .set({ title, slug: newSlug })
      .where(eq(dataset.id, datasetId));
  }

  async refreshView(id?: number) {
    await db.execute(sql`
      SELECT
        refresh_dataset_view (${id})
    `);
  }
}
