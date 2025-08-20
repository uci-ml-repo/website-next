import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset";
import { datasetQuery } from "@/server/types/dataset/request";

export const datasetFindRouter = router({
  byId: datasetAccessProcedure.query(({ ctx }) => ctx.dataset),

  byQuery: procedure.input(datasetQuery).query(({ input }) => service.dataset.find.byQuery(input)),
});
