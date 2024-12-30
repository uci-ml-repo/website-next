import type { Prisma } from "@prisma/client";
import z from "zod";

const orderByEnum: [
  Prisma.DiscussionScalarFieldEnum,
  ...Prisma.DiscussionScalarFieldEnum[],
] = ["createdAt", "upvoteCount"];

export const discussionQuery = z.object({
  datasetId: z.number().optional(),
  userId: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional(),
  orderBy: z.enum(orderByEnum).optional(),
  skip: z.number().optional(),
  take: z.number().optional(),
  cursor: z.string().optional(),
});

export type DiscussionQuery = z.infer<typeof discussionQuery>;
