import z from "zod";

import { order } from "@/server/schema/lib/order";

export const discussionQuery = z.object({
  datasetId: z.number().optional(),
  userId: z.string().optional(),
  order: order(["createdAt", "upvoteCount"]).optional(),
  search: z.string().optional(),
  limit: z.number().optional(),
  cursor: z.number().optional(),
});

export const commentQuery = z.object({
  discussionId: z.string().optional(),
  userId: z.string().optional(),
  order: order(["createdAt", "upvoteCount"]).optional(),
  limit: z.number().optional(),
  cursor: z.number().optional(),
});

export type DiscussionQuery = z.infer<typeof discussionQuery>;
export type CommentQuery = z.infer<typeof commentQuery>;
