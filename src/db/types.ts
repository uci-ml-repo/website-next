import type {
  author,
  dataset,
  datasetKeyword,
  discussion,
  discussionCommentUpvote,
  discussionUpvote,
  introductoryPaper,
  keyword,
  user,
  variable,
} from "./schema";

export type AcceptedDatasetRequiredFields =
  | "doi"
  | "yearCreated"
  | "instanceCount"
  | "description"
  | "subjectArea"
  | "characteristics"
  | "tasks"
  | "featureTypes";

export type UserSelect = typeof user.$inferSelect;

export type DatasetSelect = typeof dataset.$inferSelect;

export type DatasetKeywordSelect = typeof datasetKeyword.$inferSelect;

export type KeywordSelect = typeof keyword.$inferSelect;

export type VariableSelect = typeof variable.$inferSelect;

export type AuthorSelect = typeof author.$inferSelect;

export type IntroductoryPaperSelect = typeof introductoryPaper.$inferSelect;

export type DiscussionSelect = typeof discussion.$inferSelect;

export type DiscussionUpvoteSelect = typeof discussionUpvote.$inferSelect;

export type DiscussionCommentUpvoteSelect =
  typeof discussionCommentUpvote.$inferSelect;
