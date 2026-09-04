import { router } from "@/server/trpc";
import { userFindRouter } from "@/server/trpc/router/user/find";
import { userUpdateRouter } from "@/server/trpc/router/user/update";

export const userRouter = router({
  find: userFindRouter,
  update: userUpdateRouter,
});
