import { z } from "zod";

import { datasetQuery } from "@/server/schema/dataset";
import service from "@/server/service";
import { procedure, router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset";

const datasetFindRouter = router({
  byId: datasetAccessProcedure
    .input(z.object({ datasetId: z.number() }))
    .query(async ({ ctx }) => {
      return ctx.dataset;
    }),

  approvedById: procedure.input(z.number()).query(async ({ input }) => {
    return service.dataset.find.approvedById(input);
  }),

  byQuery: procedure.input(datasetQuery).query(async ({ input }) => {
    return service.dataset.find.byQuery(input);
  }),

  byUserId: procedure.input(z.string()).query(async ({ input }) => {
    return service.dataset.find.byUserId(input);
  }),
});

export default datasetFindRouter;
