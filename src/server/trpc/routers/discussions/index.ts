import { router } from "@/server/trpc";
import discussionsFindRouter from "@/server/trpc/routers/discussions/find";

const discussionRouter = router({
  find: discussionsFindRouter,
});

export default discussionRouter;
