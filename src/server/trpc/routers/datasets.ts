import { z } from "zod";

import { datasetQuery } from "@/server/schema/datasets";
import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const datasetsRouter = router({
  find: procedure.input(datasetQuery).query(async ({ input }) => {
    return service.datasets.find.byQuery(input);
  }),

  findById: procedure.input(z.number()).query(async ({ input }) => {
    return service.datasets.find.byId(input);
  }),

  findByTitle: procedure.input(z.string()).query(async ({ input }) => {
    return service.datasets.find.byTitle(input);
  }),

  citeById: procedure.input(z.number()).query(async ({ input }) => {
    return service.datasets.cite.byId(input);
  }),
});

export default datasetsRouter;
