import { router } from "@/server/trpc";
import { userCredentialsRouter } from "@/server/trpc/router/user/credentials";
import { userFindRouter } from "@/server/trpc/router/user/find";
import { userRemoveRouter } from "@/server/trpc/router/user/remove";

export const userRouter = router({
  credentials: userCredentialsRouter,
  find: userFindRouter,
  remove: userRemoveRouter,
});
