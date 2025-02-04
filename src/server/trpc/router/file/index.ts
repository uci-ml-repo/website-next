import { router } from "@/server/trpc";
import fileFindRouter from "@/server/trpc/router/file/find";
import fileReadRouter from "@/server/trpc/router/file/read";

const fileRouter = router({
  find: fileFindRouter,
  read: fileReadRouter,
});

export default fileRouter;
