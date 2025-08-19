import { Enums } from "@packages/db/enum";
import type { DatasetColumn } from "@packages/db/types";
import { datasetColumns } from "@packages/db/types";
import { z } from "zod";

import { order } from "@/server/types/util/order";
import { keysT } from "@/server/types/util/type";

export const range = z.object({ min: z.int(), max: z.int() }).partial();

export const datasetOrder = order<DatasetColumn[]>(keysT(datasetColumns)).optional();
export type DatasetOrder = z.infer<typeof datasetOrder>;

export const datasetQuery = z.object({
  order: datasetOrder,
  limit: z.number().int().optional().default(10),
  cursor: z.number().int().optional(),
  search: z.string().optional(),
  keywords: z.string().array().optional(),
  features: z.string().array().optional(),
  subjectAreas: z.enum(Enums.DatasetSubjectArea).array().optional(),
  dataTypes: z.enum(Enums.DatasetDataType).array().optional(),
  featureTypes: z.enum(Enums.DatasetFeatureType).array().optional(),
  tasks: z.enum(Enums.DatasetTask).array().optional(),
  featureCount: range.optional(),
  instanceCount: range.optional(),
  isAvailablePython: z.boolean().optional(),
});

export type DatasetQueryInput = z.input<typeof datasetQuery>;
export type DatasetQuery = z.infer<typeof datasetQuery>;

export const privilegedDatasetQuery = datasetQuery.extend({
  status: z.enum(Enums.ApprovalStatus).array().optional(),
  userId: z.uuid().optional(),
});

export type PrivilegedDatasetQuery = z.infer<typeof privilegedDatasetQuery>;
