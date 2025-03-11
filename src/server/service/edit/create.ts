import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { Enums } from "@/db/lib/enums";
import { dataset, edit } from "@/db/schema";
import { logger } from "@/lib/logger";
import { service } from "@/server/service";

export const datasetEditFields = z
  .object({
    title: z.string(),
    description: z.string(),
  })
  .partial();

export type DatasetEditFields = z.infer<typeof datasetEditFields>;

export class EditCreateService {
  async editFields({
    datasetId,
    userId,
    editFields,
  }: {
    datasetId: number;
    userId: string;
    editFields: DatasetEditFields;
  }) {
    const dataset = await service.dataset.find.byId(datasetId);

    logger.info("X");

    if (dataset.status === Enums.ApprovalStatus.DRAFT) {
      return this.instantEdit({ datasetId, userId, editFields });
    } else {
      return this.unapprovedEdit({ datasetId, userId, editFields });
    }
  }

  private async unapprovedEdit({
    datasetId,
    userId,
    editFields,
  }: {
    datasetId: number;
    userId: string;
    editFields: DatasetEditFields;
  }) {
    const dataset = await service.dataset.find.byId(datasetId);

    if (editFields.title) {
      dataset.title = editFields.title;
    }

    if (editFields.description) {
      dataset.description = editFields.description;
    }

    const pendingEdit = await service.edit.find.byId({
      datasetId: datasetId,
      pending: true,
    });

    if (pendingEdit) {
      return db
        .update(edit)
        .set({ newData: dataset, submittedBy: userId })
        .where(
          and(
            eq(edit.datasetId, datasetId),
            eq(edit.version, pendingEdit.version),
          ),
        )
        .returning()
        .then((res) => res[0]);
    } else {
      return db
        .insert(edit)
        .values({
          datasetId: datasetId,
          version: await service.edit.find.nextVersion(datasetId),
          newData: dataset,
          submittedBy: userId,
          status: Enums.EditStatus.PENDING,
        })
        .returning()
        .then((res) => res[0]);
    }
  }

  private async instantEdit({
    datasetId,
    editFields,
  }: {
    datasetId: number;
    userId: string;
    editFields: DatasetEditFields;
  }) {
    if (editFields.title) {
      await service.dataset.update.title({
        datasetId: datasetId,
        title: editFields.title,
      });
    }

    const [updatedDataset] = await db
      .update(dataset)
      .set({
        description: editFields.description,
      })
      .where(eq(dataset.id, datasetId))
      .returning();

    return updatedDataset;
  }
}
