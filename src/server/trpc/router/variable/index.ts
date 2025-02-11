import { router } from "@/server/trpc";
import { variableFindRouter } from "@/server/trpc/router/variable/find";

export const variableRouter = router({
  find: variableFindRouter,
});
