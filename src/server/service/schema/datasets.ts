import z from "zod";

import { order } from "@/server/service/schema/lib/order";

export const datasetQuery = z.object({
  order: order(["viewCount", "donatedAt"]).optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type DatasetQuery = z.infer<typeof datasetQuery>;
