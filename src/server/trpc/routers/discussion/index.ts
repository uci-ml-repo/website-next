import { router } from "@/server/trpc";
import discussionCommentRouter from "@/server/trpc/routers/discussion/comment";
import discussionCreateRouter from "@/server/trpc/routers/discussion/create";
import discussionFindRouter from "@/server/trpc/routers/discussion/find";
import discussionRemoveRouter from "@/server/trpc/routers/discussion/remove";
import discussionReportRouter from "@/server/trpc/routers/discussion/report";
import discussionUpdateRouter from "@/server/trpc/routers/discussion/update";
import discussionUpvoteRouter from "@/server/trpc/routers/discussion/upvote";

const discussionRouter = router({
  comment: discussionCommentRouter,
  find: discussionFindRouter,
  edit: discussionUpdateRouter,
  create: discussionCreateRouter,
  remove: discussionRemoveRouter,
  upvote: discussionUpvoteRouter,
  report: discussionReportRouter,
});

export default discussionRouter;
