import { router } from "@/server/trpc";
import keywordFindRouter from "@/server/trpc/router/keyword/find";

const keywordRouter = router({
  find: keywordFindRouter,
});

export default keywordRouter;
