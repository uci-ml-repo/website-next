import type { discussion, discussionCommentUpvote, discussionUpvote } from "@/db/schema";

export type DiscussionSelect = typeof discussion.$inferSelect;
export type DiscussionUpvoteSelect = typeof discussionUpvote.$inferSelect;
export type CommentUpvoteSelect = typeof discussionCommentUpvote.$inferSelect;
