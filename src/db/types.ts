import type {
  author,
  dataset,
  discussion,
  discussionCommentUpvote,
  discussionUpvote,
  paper,
  user,
} from "./schema";

export type AcceptedDatasetRequiredFields =
  | "yearCreated"
  | "instanceCount"
  | "description"
  | "subjectArea"
  | "characteristics"
  | "tasks"
  | "featureTypes";

export type UserSelect = typeof user.$inferSelect;

export type DatasetSelect = typeof dataset.$inferSelect;

export type AuthorSelect = typeof author.$inferSelect;

export type PaperSelect = typeof paper.$inferSelect;

export type DiscussionSelect = typeof discussion.$inferSelect;

export type DiscussionUpvoteSelect = typeof discussionUpvote.$inferSelect;

export type DiscussionCommentUpvoteSelect =
  typeof discussionCommentUpvote.$inferSelect;
