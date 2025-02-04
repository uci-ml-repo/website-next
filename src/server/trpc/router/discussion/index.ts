import { router } from "@/server/trpc";
import discussionCommentRouter from "@/server/trpc/router/discussion/comment";
import discussionCreateRouter from "@/server/trpc/router/discussion/create";
import discussionFindRouter from "@/server/trpc/router/discussion/find";
import discussionRemoveRouter from "@/server/trpc/router/discussion/remove";
import discussionReportRouter from "@/server/trpc/router/discussion/report";
import discussionUpdateRouter from "@/server/trpc/router/discussion/update";
import discussionUpvoteRouter from "@/server/trpc/router/discussion/upvote";

const discussionRouter = router({
  comment: discussionCommentRouter,
  find: discussionFindRouter,
  update: discussionUpdateRouter,
  create: discussionCreateRouter,
  remove: discussionRemoveRouter,
  upvote: discussionUpvoteRouter,
  report: discussionReportRouter,
});

export default discussionRouter;
