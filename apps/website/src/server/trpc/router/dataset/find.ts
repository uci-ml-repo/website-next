import { z } from "zod";

import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";
import { datasetQuery } from "@/server/types/dataset/request";

export const datasetFindRouter = router({
  byId: procedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => service.dataset.find.byId(input.id)),

  byQuery: procedure.input(datasetQuery).query(({ input }) => service.dataset.find.byQuery(input)),
});
