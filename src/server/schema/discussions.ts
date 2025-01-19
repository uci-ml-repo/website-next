import z from "zod";

export const discussionQuery = z.object({
  datasetId: z.number().optional(),
  userId: z.string().optional(),
  selectUpvoteUserId: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  excludeReplies: z.boolean().optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
  cursor: z.string().optional(),
});

export type DiscussionQuery = z.infer<typeof discussionQuery>;
