import { router } from "@/server/trpc";
import discussionsCreateRouter from "@/server/trpc/routers/discussions/create";
import discussionsEditRouter from "@/server/trpc/routers/discussions/edit";
import discussionsFindRouter from "@/server/trpc/routers/discussions/find";

const discussionsRouter = router({
  find: discussionsFindRouter,
  edit: discussionsEditRouter,
  create: discussionsCreateRouter,
  remove: discussionsEditRouter,
});

export default discussionsRouter;
