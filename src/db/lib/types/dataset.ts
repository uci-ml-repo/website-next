import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { Enums } from "@/db/lib/enums";
import { selectColumns } from "@/db/lib/utils";
import { author, datasetView, paper, user, variable } from "@/db/schema";
import { enumToArray } from "@/lib/utils";

export type DatasetSelect = typeof datasetView.$inferSelect;

export const datasetIdentificationSelect = {
  id: datasetView.id,
  slug: datasetView.slug,
  title: datasetView.title,
};

export const datasetPreviewSelect = {
  ...datasetIdentificationSelect,
  yearCreated: datasetView.yearCreated,
  description: datasetView.description,
  doi: datasetView.doi,
  subjectArea: datasetView.subjectArea,
  instanceCount: datasetView.instanceCount,
  featureCount: datasetView.featureCount,
  hasGraphics: datasetView.hasGraphics,
  isAvailablePython: datasetView.isAvailablePython,
  externalLink: datasetView.externalLink,
  status: datasetView.status,
  viewCount: datasetView.viewCount,
  downloadCount: datasetView.downloadCount,
  dataTypes: datasetView.dataTypes,
  tasks: datasetView.tasks,
  featureTypes: datasetView.featureTypes,
  size: datasetView.size,
  fileCount: datasetView.fileCount,
  userId: datasetView.userId,
  donatedAt: datasetView.donatedAt,
};

export const datasetIdentificationSelectColumns = selectColumns(datasetIdentificationSelect);

export const datasetIdentificationSelectSchema = createSelectSchema(datasetView).pick(
  datasetIdentificationSelectColumns,
);

export const datasetPreviewSelectColumns = selectColumns(datasetPreviewSelect);

export const datasetPreviewSelectSchema = createSelectSchema(datasetView).pick(
  datasetPreviewSelectColumns,
);

export type DatasetPreviewSelect = z.infer<typeof datasetPreviewSelectSchema>;

export type DatasetIdentificationSelect = z.infer<typeof datasetIdentificationSelectSchema>;

export const datasetPreApprovalSelect = createSelectSchema(datasetView).extend({
  yearCreated: z.number().int(),
  instanceCount: z.number().int(),
  description: z.string().min(20),
  subjectArea: z.enum(enumToArray(Enums.DatasetSubjectArea)),
  authors: createSelectSchema(author).array(),
  variables: createSelectSchema(variable).array(),
  user: createSelectSchema(user),
  introductoryPaper: createSelectSchema(paper),
});

export type DatasetPreApprovalSelect = z.infer<typeof datasetPreApprovalSelect>;

export const datasetApprovedSelect = datasetPreApprovalSelect.extend({
  doi: z.string(),
});

export type DatasetApprovedSelect = z.infer<typeof datasetApprovedSelect>;
