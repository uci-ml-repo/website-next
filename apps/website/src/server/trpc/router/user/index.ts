import { router } from "@server/trpc";
import { userFindRouter } from "@server/trpc/router/user/find";

export const userRouter = router({
  find: userFindRouter,
});
