import { z } from "zod";

import { datasetQuery } from "@/server/schema/datasets";
import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const datasetFindRouter = router({
  byQuery: procedure.input(datasetQuery).query(async ({ input }) => {
    return service.datasets.find.byQuery(input);
  }),

  byId: procedure.input(z.number()).query(async ({ input }) => {
    return service.datasets.find.byId(input);
  }),

  byTitle: procedure.input(z.string()).query(async ({ input }) => {
    return service.datasets.find.byTitle(input);
  }),

  byUserId: procedure.input(z.string()).query(async ({ input }) => {
    return service.datasets.find.byUserId(input);
  }),
});

export default datasetFindRouter;
