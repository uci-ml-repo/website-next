import { z } from "zod";

import { datasetQuery, privilegedDatasetQuery } from "@/server/schema/dataset";
import { service } from "@/server/service";
import { procedure, protectedProcedure, router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset-access";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

export const datasetFindRouter = router({
  byId: datasetAccessProcedure
    .input(z.object({ datasetId: z.number() }))
    .query(({ ctx }) => ctx.dataset),

  approvedById: procedure
    .input(z.number())
    .query(({ input }) => service.dataset.find.approvedById(input)),

  byQuery: procedure
    .input(datasetQuery)
    .query(({ input }) => service.dataset.find.byQuery(input)),

  countByQuery: procedure
    .input(datasetQuery)
    .query(({ input }) => service.dataset.find.countByQuery(input)),

  privilegedCountByQuery: protectedProcedure
    .meta([
      MiddlewareRoles.ADMIN,
      MiddlewareRoles.CURATOR,
      MiddlewareRoles.LIBRARIAN,
      MiddlewareRoles.IS_USER_ID,
    ])
    .input(privilegedDatasetQuery)
    .query(({ input }) => service.dataset.find.countByQuery(input)),

  privilegedByQuery: protectedProcedure
    .meta([MiddlewareRoles.ADMIN, MiddlewareRoles.IS_USER_ID])
    .input(privilegedDatasetQuery)
    .query(({ input }) => service.dataset.find.byQuery(input)),
});
