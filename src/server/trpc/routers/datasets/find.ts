import { z } from "zod";

import service from "@/server/service";
import { datasetQuery } from "@/server/service/schema/datasets";
import { procedure, router } from "@/server/trpc";

const datasetsFindRouter = router({
  byId: procedure.input(z.number()).query(async ({ input }) => {
    return service.datasets.find.byId(input);
  }),

  byQuery: procedure.input(datasetQuery).query(async ({ input }) => {
    return service.datasets.find.byQuery(input);
  }),

  byTitle: procedure.input(z.string()).query(async ({ input }) => {
    return service.datasets.find.byTitle(input);
  }),

  byUserId: procedure.input(z.string()).query(async ({ input }) => {
    return service.datasets.find.byUserId(input);
  }),
});

export default datasetsFindRouter;
