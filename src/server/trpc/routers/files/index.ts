import { router } from "@/server/trpc";
import filesFindRouter from "@/server/trpc/routers/files/find";
import filesReadRouter from "@/server/trpc/routers/files/read";

const filesRouter = router({
  find: filesFindRouter,
  read: filesReadRouter,
});

export default filesRouter;
