import z from "zod";

import { order } from "@/server/schema/lib/order";

export const datasetQuery = z.object({
  order: order(["viewCount", "donatedAt"]).optional(),
  keywords: z.array(z.string()).optional(),
  search: z.string().optional(),
  limit: z.number().optional(),
  cursor: z.number().optional(),
});

export type DatasetQuery = z.infer<typeof datasetQuery>;
