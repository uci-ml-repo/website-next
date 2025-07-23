import { router } from "@website/server/trpc";
import { userFindRouter } from "@website/server/trpc/router/user/find";

export const userRouter = router({
  find: userFindRouter,
});
