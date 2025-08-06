import { router } from "@/server/trpc";
import { datasetFindRouter } from "@/server/trpc/router/dataset/find";
import { datasetStatRouter } from "@/server/trpc/router/dataset/stat";

export const datasetRouter = router({
  find: datasetFindRouter,
  stat: datasetStatRouter,
});
