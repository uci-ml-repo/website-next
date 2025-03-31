import { eq, sql } from "drizzle-orm";
import fs from "fs-extra";

import { db } from "@/db";
import { dataset } from "@/db/schema";
import {
  DATASET_FILES_THUMBNAIL_PATH,
  DATASET_FILES_THUMBNAIL_PENDING_PATH,
  DATASET_FILES_UNZIPPED_PATH,
  DATASET_FILES_UNZIPPED_PENDING_PATH,
  DATASET_FILES_ZIP_PATH,
  DATASET_FILES_ZIP_PENDING_PATH,
} from "@/lib/routes";
import { absoluteStaticPath } from "@/lib/utils/file";
import { service } from "@/server/service";
import { ServiceError } from "@/server/service/errors";

export namespace datasetUpdateService {
  export async function zipStats(input: { id: number; slug: string; status: string }) {
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

  export async function title({ datasetId, title }: { datasetId: number; title: string }) {
    const existingDataset = await service.dataset.find.byId(datasetId);
    const newSlug = await service.dataset.create.getSlug(title);

    if (!existingDataset.externalLink) {
      const oldZipPath = absoluteStaticPath(DATASET_FILES_ZIP_PATH(existingDataset));

      if (fs.existsSync(oldZipPath)) {
        const newZipPath = absoluteStaticPath(
          DATASET_FILES_ZIP_PATH({ ...existingDataset, slug: newSlug }),
        );

        fs.moveSync(oldZipPath, newZipPath, { overwrite: true });
      }

      const oldUnzippedPath = absoluteStaticPath(DATASET_FILES_UNZIPPED_PATH(existingDataset));

      if (fs.existsSync(oldUnzippedPath)) {
        const newUnzippedPath = absoluteStaticPath(
          DATASET_FILES_UNZIPPED_PATH({ ...existingDataset, slug: newSlug }),
        );

        fs.moveSync(oldUnzippedPath, newUnzippedPath, { overwrite: true });
      }

      const oldPendingZipPath = absoluteStaticPath(DATASET_FILES_ZIP_PENDING_PATH(existingDataset));

      if (fs.existsSync(oldPendingZipPath)) {
        const newPendingZipPath = absoluteStaticPath(
          DATASET_FILES_ZIP_PENDING_PATH({ ...existingDataset, slug: newSlug }),
        );

        fs.moveSync(oldPendingZipPath, newPendingZipPath, { overwrite: true });
      }

      const oldPendingUnzippedPath = absoluteStaticPath(
        DATASET_FILES_UNZIPPED_PENDING_PATH(existingDataset),
      );

      if (fs.existsSync(oldPendingUnzippedPath)) {
        const newPendingUnzippedPath = absoluteStaticPath(
          DATASET_FILES_UNZIPPED_PENDING_PATH({
            ...existingDataset,
            slug: newSlug,
          }),
        );

        fs.moveSync(oldPendingUnzippedPath, newPendingUnzippedPath, {
          overwrite: true,
        });
      }
    }

    const [updatedDataset] = await db
      .update(dataset)
      .set({ title, slug: newSlug })
      .where(eq(dataset.id, datasetId))
      .returning();

    return updatedDataset;
  }

  export async function hasGraphics({
    datasetId,
    hasGraphics,
  }: {
    datasetId: number;
    hasGraphics: boolean;
  }) {
    const existingDataset = await service.dataset.find.byId(datasetId);

    const thumbnailPath = absoluteStaticPath(DATASET_FILES_THUMBNAIL_PATH(existingDataset));

    if (!hasGraphics) {
      const pendingThumbnailPath = absoluteStaticPath(
        DATASET_FILES_THUMBNAIL_PENDING_PATH(existingDataset),
      );

      if (fs.existsSync(thumbnailPath)) {
        fs.removeSync(thumbnailPath);
      }

      if (fs.existsSync(pendingThumbnailPath)) {
        fs.removeSync(pendingThumbnailPath);
      }
    } else {
      if (!fs.existsSync(thumbnailPath)) {
        throw new ServiceError({
          origin: "Dataset",
          message: "Cannot set hasGraphics to true without an existing thumbnail",
        });
      }
    }

    return await db
      .update(dataset)
      .set({
        hasGraphics,
      })
      .where(eq(dataset.id, datasetId))
      .returning();
  }

  export async function refreshView(id?: number) {
    await db.execute(sql`
      SELECT
        refresh_dataset_view (${id})
    `);
  }
}
