import { router } from "@/server/trpc";
import { fileFindRouter } from "@/server/trpc/router/file/find";

export const fileRouter = router({
  find: fileFindRouter,
});
