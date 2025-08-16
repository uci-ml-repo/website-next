import { dataset } from "@packages/db/schema";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const datasetSelectSchema = createSelectSchema(dataset);

export type DatasetSelect = z.infer<typeof datasetSelectSchema>;
