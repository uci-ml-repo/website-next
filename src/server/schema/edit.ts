import z from "zod";

import { Enums } from "@/db/lib/enums";
import { enumToArray } from "@/lib/utils";

export const editQuery = z.object({
  datasetId: z.number().optional(),
  status: z.enum(enumToArray(Enums.EditStatus)).array().optional(),
  offset: z.number().optional(),
  limit: z.number().optional(),
});

export type EditQuery = z.infer<typeof editQuery>;
