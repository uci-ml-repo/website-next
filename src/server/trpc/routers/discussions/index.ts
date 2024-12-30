import { router } from "@/server/trpc";
import discussionsCreateRouter from "@/server/trpc/routers/discussions/create";
import discussionsEditRouter from "@/server/trpc/routers/discussions/edit";
import discussionsFindRouter from "@/server/trpc/routers/discussions/find";
import discussionsRemoveRouter from "@/server/trpc/routers/discussions/remove";
import discussionsReportRouter from "@/server/trpc/routers/discussions/report";
import discussionsUpvoteRouter from "@/server/trpc/routers/discussions/upvote";

const discussionsRouter = router({
  find: discussionsFindRouter,
  edit: discussionsEditRouter,
  create: discussionsCreateRouter,
  remove: discussionsRemoveRouter,
  upvote: discussionsUpvoteRouter,
  report: discussionsReportRouter,
});

export default discussionsRouter;
