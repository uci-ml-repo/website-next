import { z } from "zod";

import { datasetQuery } from "@/server/schema/dataset";
import { service } from "@/server/service";
import { procedure, protectedProcedure, router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

export const datasetFindRouter = router({
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

  byUserId: protectedProcedure
    .meta({ requireRoles: [MiddlewareRoles.ADMIN, MiddlewareRoles.IS_USER_ID] })
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ input }) => {
      return service.dataset.find.byUserId(input);
    }),
});
