import { z } from "zod";

import type { RequireNonNullable } from "@/lib/utils";

import type { author, dataset, discussionUpvote, paper, user } from "./schema";

export type AcceptedDatasetRequiredFields =
  | "yearCreated"
  | "instanceCount"
  | "description"
  | "subjectArea"
  | "characteristics"
  | "tasks"
  | "featureTypes";

export const acceptedDataset = z.object({
  yearCreated: z.number(),
  instanceCount: z.number(),
  description: z.string(),
  subjectArea: z.string(),
  characteristics: z.array(z.string()),
  tasks: z.array(z.string()),
  featureTypes: z.array(z.string()),
});

export type UserSelect = typeof user.$inferSelect;

export type DatasetSelect = typeof dataset.$inferSelect;
export type AcceptedDatasetSelect = RequireNonNullable<
  DatasetSelect,
  AcceptedDatasetRequiredFields
>;

export type AuthorSelect = typeof author.$inferSelect;

export type PaperSelect = typeof paper.$inferSelect;

export type DiscussionUpvoteSelect = typeof discussionUpvote.$inferSelect;
