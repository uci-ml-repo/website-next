import z from "zod";

import { Enums } from "@/db/lib/enums";
import { enumToArray } from "@/lib/utils";
import { order } from "@/server/schema/lib/order";

export const datasetQuery = z.object({
  order: order([
    "viewCount",
    "donatedAt",
    "instanceCount",
    "featureCount",
    "title",
  ]).optional(),
  search: z.string().optional(),
  limit: z.number().int().optional(),
  cursor: z.number().int().optional(),
  keywords: z.array(z.string()).optional(),
  attributes: z.array(z.string()).optional(),
  dataTypes: z.array(z.enum(enumToArray(Enums.DatasetDataType))).optional(),
  subjectAreas: z
    .array(z.enum(enumToArray(Enums.DatasetSubjectArea)))
    .optional(),
  tasks: z.array(z.enum(enumToArray(Enums.DatasetTask))).optional(),
  featureTypes: z
    .array(z.enum(enumToArray(Enums.DatasetFeatureType)))
    .optional(),
  instanceCountMin: z.number().int().min(0).optional(),
  instanceCountMax: z.number().int().min(0).optional(),
  featureCountMin: z.number().int().min(0).optional(),
  featureCountMax: z.number().int().min(0).optional(),
  python: z.boolean().optional(),
});

export const privilegedDatasetQuery = datasetQuery.extend({
  status: z.enum(enumToArray(Enums.ApprovalStatus)).optional(),
});

export const datasetSearchQuery = datasetQuery.required({ search: true });

export type DatasetQuery = z.infer<typeof datasetQuery>;
export type PrivilegedDatasetQuery = z.infer<typeof privilegedDatasetQuery>;
export type DatasetSearchQuery = z.infer<typeof datasetSearchQuery>;
