import { router } from "@/server/trpc";
import draftDatasetFindRouter from "@/server/trpc/routers/drafts/find";

const draftDatasetsRouter = router({
  find: draftDatasetFindRouter,
});

export default draftDatasetsRouter;
