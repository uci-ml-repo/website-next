import { z } from "zod";

import service from "@/server/service";
import { datasetQuery } from "@/server/service/schema/dataset";
import { procedure, router } from "@/server/trpc";

const datasetFindRouter = router({
  byId: procedure.input(z.number()).query(async ({ input }) => {
    return service.dataset.find.byId(input);
  }),

  byQuery: procedure.input(datasetQuery).query(async ({ input }) => {
    return service.dataset.find.byQuery(input);
  }),

  byUserId: procedure.input(z.string()).query(async ({ input }) => {
    return service.dataset.find.byUserId(input);
  }),
});

export default datasetFindRouter;
