import z from "zod";

import { order } from "@/server/service/schema/lib/order";

export const discussionQuery = z.object({
  datasetId: z.number().optional(),
  userId: z.string().optional(),
  order: order(["createdAt", "upvoteCount"]).optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type DiscussionQuery = z.infer<typeof discussionQuery>;
