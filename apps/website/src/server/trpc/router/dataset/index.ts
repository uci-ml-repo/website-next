import { router } from "@/server/trpc";
import { datasetFindRouter } from "@/server/trpc/router/dataset/find";

export const datasetRouter = router({
  find: datasetFindRouter,
});
