import { router } from "@/server/trpc";
import filesFindRouter from "@/server/trpc/routers/files/find";

const filesRouter = router({
  find: filesFindRouter,
});

export default filesRouter;
