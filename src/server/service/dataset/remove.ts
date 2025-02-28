import { eq } from "drizzle-orm";

import { db } from "@/db";
import { Enums } from "@/db/lib/enums";
import { dataset } from "@/db/schema";
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

    if (
      ![Enums.ApprovalStatus.DRAFT, Enums.ApprovalStatus.PENDING].includes(
        existingDataset.status,
      )
    ) {
      throw new ServiceError({
        origin: "Dataset",
        message: "Dataset must be in draft or pending status to be deleted",
      });
    }

    return db.delete(dataset).where(eq(dataset.id, datasetId)).returning();
  }
}
