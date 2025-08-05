import { Enums, enumToArray } from "@packages/db/enum";
import { dataset } from "@packages/db/schema";
import { getTableColumns } from "drizzle-orm";
import { z } from "zod";

import { order } from "@/server/types/util/order";
import { keysT } from "@/server/types/util/type";

export const datasetColumns = getTableColumns(dataset);
type DatasetColumn = keyof typeof datasetColumns;

export const datasetQuery = z.object({
  order: order<DatasetColumn[]>(keysT(datasetColumns)).optional(),
  limit: z.number().int().optional().default(10),
  cursor: z.number().int().optional(),
  search: z.string().optional(),
  subjectAreas: z.array(z.enum(enumToArray(Enums.DatasetSubjectArea))).optional(),
  isAvailablePython: z.boolean().optional(),
});

export type DatasetQueryInput = z.input<typeof datasetQuery>;
export type DatasetQuery = z.infer<typeof datasetQuery>;

export const privilegedDatasetQuery = datasetQuery.extend({
  status: z.enum(enumToArray(Enums.ApprovalStatus)).array().optional(),
  userId: z.uuid().optional(),
});

export type PrivilegedDatasetQuery = z.infer<typeof privilegedDatasetQuery>;
