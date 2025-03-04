import { eq } from "drizzle-orm";
import fs from "fs-extra";
import path from "path";

import { db } from "@/db";
import { dataset } from "@/db/schema";
import { DATASET_FILES_PATH } from "@/lib/routes";
import { ServiceError } from "@/server/service/errors";

export class DatasetRemoveService {
  async byId(datasetId: number) {
    if (!process.env.STATIC_FILES_DIRECTORY) {
      throw new Error("No STATIC_FILES_DIRECTORY defined");
    }

    const existingDataset = await db.query.dataset.findFirst({
      where: eq(dataset.id, datasetId),
    });

    if (!existingDataset) {
      throw new ServiceError({
        origin: "Dataset",
        message: "Dataset not found",
      });
    }

    fs.removeSync(
      path.join(
        process.env.STATIC_FILES_DIRECTORY,
        DATASET_FILES_PATH(existingDataset),
      ),
    );

    return db.delete(dataset).where(eq(dataset.id, datasetId)).returning();
  }
}
