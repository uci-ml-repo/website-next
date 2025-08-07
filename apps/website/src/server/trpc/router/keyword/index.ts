import { router } from "@/server/trpc";
import { keywordFindRouter } from "@/server/trpc/router/keyword/find";

export const keywordRouter = router({
  find: keywordFindRouter,
});
