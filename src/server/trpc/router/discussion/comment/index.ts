import { router } from "@/server/trpc";
import { discussionCommentCreateRouter } from "@/server/trpc/router/discussion/comment/create";
import { discussionCommentFindRouter } from "@/server/trpc/router/discussion/comment/find";
import { discussionCommentRemoveRouter } from "@/server/trpc/router/discussion/comment/remove";
import { discussionCommentUpdateRouter } from "@/server/trpc/router/discussion/comment/update";
import { discussionCommentUpvoteRouter } from "@/server/trpc/router/discussion/comment/upvote";

export const discussionCommentRouter = router({
  find: discussionCommentFindRouter,
  create: discussionCommentCreateRouter,
  update: discussionCommentUpdateRouter,
  remove: discussionCommentRemoveRouter,
  upvote: discussionCommentUpvoteRouter,
});
