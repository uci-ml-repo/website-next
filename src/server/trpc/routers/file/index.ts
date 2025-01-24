import { router } from "@/server/trpc";
import fileFindRouter from "@/server/trpc/routers/file/find";
import fileReadRouter from "@/server/trpc/routers/file/read";

const fileRouter = router({
  find: fileFindRouter,
  read: fileReadRouter,
});

export default fileRouter;
