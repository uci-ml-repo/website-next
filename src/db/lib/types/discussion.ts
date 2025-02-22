import type { commentUpvote, discussion, discussionUpvote } from "@/db/schema";

export type DiscussionSelect = typeof discussion.$inferSelect;
export type DiscussionUpvoteSelect = typeof discussionUpvote.$inferSelect;
export type CommentUpvoteSelect = typeof commentUpvote.$inferSelect;
