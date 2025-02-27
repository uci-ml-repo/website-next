import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { selectColumns } from "@/db/lib/utils";
import { datasetView } from "@/db/schema";
export type AcceptedDatasetRequiredFields =
  | "doi"
  | "yearCreated"
  | "instanceCount"
  | "description"
  | "subjectArea"
  | "dataTypes"
  | "tasks"
  | "featureTypes";

export type DatasetSelect = typeof datasetView.$inferSelect;

export const datasetIdentificationSelect = {
  id: datasetView.id,
  slug: datasetView.slug,
  title: datasetView.title,
};

export const datasetPreviewSelect = {
  ...datasetIdentificationSelect,
  yearCreated: datasetView.yearCreated,
  subtitle: datasetView.subtitle,
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

export const datasetIdentificationSelectColumns = selectColumns(
  datasetIdentificationSelect,
);

export const datasetIdentificationSelectSchema = createSelectSchema(
  datasetView,
).pick(datasetIdentificationSelectColumns);

export const datasetPreviewSelectColumns = selectColumns(datasetPreviewSelect);

export const datasetPreviewSelectSchema = createSelectSchema(datasetView).pick(
  datasetPreviewSelectColumns,
);

export type DatasetPreviewSelect = z.infer<typeof datasetPreviewSelectSchema>;

export type DatasetIdentificationSelect = z.infer<
  typeof datasetIdentificationSelectSchema
>;
