import { router } from "@/server/trpc";
import userCredentialsRouter from "@/server/trpc/router/user/credentials";

const userRouter = router({
  credentials: userCredentialsRouter,
});

export default userRouter;
