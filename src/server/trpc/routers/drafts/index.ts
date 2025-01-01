import { router } from "@/server/trpc";
import draftDatasetsFindRouter from "@/server/trpc/routers/drafts/find";

const draftDatasetsRouter = router({
  find: draftDatasetsFindRouter,
});

export default draftDatasetsRouter;
