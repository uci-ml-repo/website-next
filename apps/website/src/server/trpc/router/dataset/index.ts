import { router } from "@/server/trpc";
import { datasetDonationRouter } from "@/server/trpc/router/dataset/donation";
import { datasetFindRouter } from "@/server/trpc/router/dataset/find";
import { datasetStatRouter } from "@/server/trpc/router/dataset/stat";

export const datasetRouter = router({
  donation: datasetDonationRouter,
  find: datasetFindRouter,
  stat: datasetStatRouter,
});
