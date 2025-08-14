import { Enums } from "@packages/db/enum";
import { dataset } from "@packages/db/schema";
import { getTableColumns } from "drizzle-orm";
import { z } from "zod";

import { order } from "@/server/types/util/order";
import { keysT } from "@/server/types/util/type";

export const datasetColumns = getTableColumns(dataset);
type DatasetColumn = keyof typeof datasetColumns;

export const range = z.object({ min: z.int(), max: z.int() }).partial();

export const datasetOrder = order<DatasetColumn[]>(keysT(datasetColumns)).optional();
export type DatasetOrder = z.infer<typeof datasetOrder>;

export const datasetQuery = z.object({
  order: datasetOrder,
  limit: z.number().int().optional().default(10),
  cursor: z.number().int().optional(),
  search: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
  subjectAreas: z.array(z.enum(Enums.DatasetSubjectArea)).optional(),
  dataTypes: z.array(z.enum(Enums.DatasetDataType)).optional(),
  featureTypes: z.array(z.enum(Enums.DatasetFeatureType)).optional(),
  featureCount: range.optional(),
  instanceCount: range.optional(),
  tasks: z.array(z.enum(Enums.DatasetTask)).optional(),
  isAvailablePython: z.boolean().optional(),
});

export type DatasetQueryInput = z.input<typeof datasetQuery>;
export type DatasetQuery = z.infer<typeof datasetQuery>;

export const privilegedDatasetQuery = datasetQuery.extend({
  status: z.enum(Enums.ApprovalStatus).array().optional(),
  userId: z.uuid().optional(),
});

export type PrivilegedDatasetQuery = z.infer<typeof privilegedDatasetQuery>;
