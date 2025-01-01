import { z } from "zod";

import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const datasetsCiteRouter = router({
  byId: procedure.input(z.number()).query(async ({ input }) => {
    return service.datasets.cite.byDatasetId(input);
  }),
});

export default datasetsCiteRouter;
