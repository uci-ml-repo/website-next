import { Enums } from "@packages/db/enum";
import { z } from "zod";

const title = z.string().trim().min(1, "Title is required").max(255);
const description = z.string().trim().min(1, "Description is required").max(10_000);
const count = z.int().min(0).max(2_147_483_647);
const yearCreated = z.int().min(1).max(new Date().getFullYear());

export const createDatasetDraft = z.object({ title, description });
export type CreateDatasetDraft = z.infer<typeof createDatasetDraft>;

export const datasetDraftFields = createDatasetDraft.extend({
  yearCreated: yearCreated.nullable(),
  subjectArea: z.enum(Enums.DatasetSubjectArea).nullable(),
  instanceCount: count.nullable(),
  featureCount: count.nullable(),
  externalLink: z
    .url({ protocol: /^https?$/ })
    .max(2048)
    .nullable(),
  citation: z.string().trim().max(10_000).nullable(),
  dataTypes: z.enum(Enums.DatasetDataType).array().max(Object.keys(Enums.DatasetDataType).length),
  tasks: z.enum(Enums.DatasetTask).array().max(Object.keys(Enums.DatasetTask).length),
  featureTypes: z
    .enum(Enums.DatasetFeatureType)
    .array()
    .max(Object.keys(Enums.DatasetFeatureType).length),
});
export type DatasetDraftFields = z.infer<typeof datasetDraftFields>;

export const datasetReviewFields = datasetDraftFields.extend({
  yearCreated,
  subjectArea: z.enum(Enums.DatasetSubjectArea, { error: "Choose a subject area" }),
  instanceCount: count,
});

export const datasetDraftId = z.object({ datasetId: z.int().positive() });
export const updateDatasetDraft = datasetDraftId.extend({ fields: datasetDraftFields });
export const submitDatasetDraft = datasetDraftId.extend({ fields: datasetReviewFields });

export const MAX_DATASET_ARCHIVE_SIZE = 100 * 1024 * 1024;
export const datasetArchiveUpload = datasetDraftId.extend({
  name: z
    .string()
    .trim()
    .min(1)
    .max(255)
    .regex(/\.zip$/i, "Choose a ZIP archive"),
  size: z.int().min(1).max(MAX_DATASET_ARCHIVE_SIZE, "ZIP archives must be 100 MB or smaller"),
});
export const completeDatasetArchiveUpload = datasetDraftId.extend({ key: z.string().max(512) });
