import { router } from "@/server/trpc";
import discussionCommentCreateRouter from "@/server/trpc/routers/discussion/comment/create";
import discussionCommentFindRouter from "@/server/trpc/routers/discussion/comment/find";
import discussionCommentRemoveRouter from "@/server/trpc/routers/discussion/comment/remove";
import discussionCommentReportRouter from "@/server/trpc/routers/discussion/comment/report";
import discussionCommentUpdateRouter from "@/server/trpc/routers/discussion/comment/update";
import discussionCommentUpvoteRouter from "@/server/trpc/routers/discussion/comment/upvote";

const discussionCommentRouter = router({
  find: discussionCommentFindRouter,
  create: discussionCommentCreateRouter,
  update: discussionCommentUpdateRouter,
  remove: discussionCommentRemoveRouter,
  report: discussionCommentReportRouter,
  upvote: discussionCommentUpvoteRouter,
});

export default discussionCommentRouter;
