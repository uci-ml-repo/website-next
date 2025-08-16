import { dataset } from "@packages/db/schema";
import { createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

import type { RouterOutput } from "@/server/trpc/router";

export const datasetSelectSchema = createSelectSchema(dataset);

export type DatasetSelect = z.infer<typeof datasetSelectSchema>;

export type DatasetFull = RouterOutput["dataset"]["find"]["byId"];
