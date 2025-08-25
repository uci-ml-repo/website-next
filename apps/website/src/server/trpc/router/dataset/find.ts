import { TRPCError } from "@trpc/server";

import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset";
import { datasetQuery } from "@/server/types/dataset/request";

export const datasetFindRouter = router({
  simpleById: datasetAccessProcedure.query(({ ctx }) => ctx.dataset),

  byId: datasetAccessProcedure.query(async ({ ctx }) => {
    const dataset = await service.dataset.find.byId(ctx.dataset.id);

    if (!dataset) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Dataset not found",
      });
    }

    return dataset;
  }),

  byQuery: procedure.input(datasetQuery).query(({ input }) => service.dataset.find.byQuery(input)),
});
