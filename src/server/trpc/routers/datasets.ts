import { z } from "zod";

import { datasetQuery } from "@/server/schema/datasets";
import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const datasetsRouter = router({
  find: procedure.input(datasetQuery).query(async ({ input }) => {
    const datasets = service.datasets.find.byQuery(input);
    return datasets;
  }),

  findById: procedure.input(z.number()).query(async ({ input }) => {
    const dataset = service.datasets.find.byId(input);
    return dataset;
  }),
});

export default datasetsRouter;
