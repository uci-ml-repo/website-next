import { getTableColumns } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import { dataset } from "../schema";

export const datasetColumns = getTableColumns(dataset);
export type DatasetColumn = keyof typeof datasetColumns;

export const datasetSelectSchema = createSelectSchema(dataset);
export type DatasetSelect = z.infer<typeof datasetSelectSchema>;
