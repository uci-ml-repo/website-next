import { z } from "zod";

import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const datasetCiteRouter = router({
  byId: procedure
    .input(z.number())
    .query(({ input }) => service.dataset.cite.byDatasetId(input)),
});
