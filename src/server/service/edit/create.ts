import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { Enums } from "@/db/lib/enums";
import { dataset, edit } from "@/db/schema";
import { enumToArray } from "@/lib/utils";
import { service } from "@/server/service";

export const datasetEditFields = z
  .object({
    title: z.string(),
    description: z.string(),
    subjectArea: z.enum(enumToArray(Enums.DatasetSubjectArea)),
    instanceCount: z.number().int().nonnegative(),
  })
  .partial();

export type DatasetEditFields = z.infer<typeof datasetEditFields>;

export namespace editCreateService {
  export async function editFields({
    datasetId,
    userId,
    editFields,
  }: {
    datasetId: number;
    userId: string;
    editFields: DatasetEditFields;
  }) {
    const dataset = await service.dataset.find.byId(datasetId);

    return dataset.status === Enums.ApprovalStatus.DRAFT
      ? instantEdit({ datasetId, userId, editFields })
      : unapprovedEdit({ datasetId, userId, editFields });
  }

  async function unapprovedEdit({
    datasetId,
    userId,
    editFields,
  }: {
    datasetId: number;
    userId: string;
    editFields: DatasetEditFields;
  }) {
    const dataset = await service.dataset.find.byId(datasetId);

    if (editFields.title) dataset.title = editFields.title;
    if (editFields.description) dataset.description = editFields.description;
    if (editFields.subjectArea) dataset.subjectArea = editFields.subjectArea;

    const pendingEdit = await service.edit.find.byId({
      datasetId,
      pending: true,
    });

    return pendingEdit
      ? db
          .update(edit)
          .set({ newData: dataset, submittedBy: userId })
          .where(and(eq(edit.datasetId, datasetId), eq(edit.version, pendingEdit.version)))
          .returning()
          .then((res) => res[0].newData)
      : db
          .insert(edit)
          .values({
            datasetId,
            version: await service.edit.find.nextVersion(datasetId),
            newData: dataset,
            submittedBy: userId,
            status: Enums.EditStatus.PENDING,
          })
          .returning()
          .then((res) => res[0].newData);
  }

  async function instantEdit({
    datasetId,
    editFields,
  }: {
    datasetId: number;
    userId: string;
    editFields: DatasetEditFields;
  }) {
    if (editFields.title) {
      await service.dataset.update.title({
        datasetId,
        title: editFields.title,
      });
    }

    const [updatedDataset] = await db
      .update(dataset)
      .set({
        description: editFields.description,
        subjectArea: editFields.subjectArea,
      })
      .where(eq(dataset.id, datasetId))
      .returning();

    return updatedDataset;
  }
}
