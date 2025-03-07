import { eq } from "drizzle-orm";
import fs from "fs-extra";

import { db } from "@/db";
import { dataset } from "@/db/schema";
import { DATASET_FILES_PATH } from "@/lib/routes";
import { absoluteStaticPath } from "@/lib/utils/file";
import { ServiceError } from "@/server/service/errors";

export class DatasetRemoveService {
  async byId(datasetId: number) {
    const existingDataset = await db.query.dataset.findFirst({
      where: eq(dataset.id, datasetId),
    });

    if (!existingDataset) {
      throw new ServiceError({
        origin: "Dataset",
        message: "Dataset not found",
      });
    }

    fs.removeSync(absoluteStaticPath(DATASET_FILES_PATH(existingDataset)));

    return db.delete(dataset).where(eq(dataset.id, datasetId)).returning();
  }
}
