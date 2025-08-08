import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";
import { datasetQuery } from "@/server/types/dataset/request";

export const featureFindRouter = router({
  remainingFilters: procedure
    .input(datasetQuery)
    .query(({ input }) => service.feature.find.remainingFilters(input)),
});
