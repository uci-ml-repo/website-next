import type {
  author,
  commentUpvote,
  dataset,
  datasetKeyword,
  discussion,
  discussionUpvote,
  keyword,
  paper,
  user,
  variable,
} from "@/db/schema";

export type AcceptedDatasetRequiredFields =
  | "doi"
  | "yearCreated"
  | "instanceCount"
  | "description"
  | "subjectArea"
  | "dataTypes"
  | "tasks"
  | "featureTypes";

export type UserSelect = typeof user.$inferSelect;

export type DatasetSelect = typeof dataset.$inferSelect;

export type DatasetKeywordSelect = typeof datasetKeyword.$inferSelect;

export type KeywordSelect = typeof keyword.$inferSelect;

export type VariableSelect = typeof variable.$inferSelect;

export type AuthorSelect = typeof author.$inferSelect;

export type PaperSelect = typeof paper.$inferSelect;

export type DiscussionSelect = typeof discussion.$inferSelect;

export type DiscussionUpvoteSelect = typeof discussionUpvote.$inferSelect;

export type CommentUpvoteSelect = typeof commentUpvote.$inferSelect;
