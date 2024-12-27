import { z } from "zod";

import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const draftDatasetFindRouter = router({
  byId: procedure.input(z.string()).query(async ({ input }) => {
    return service.draftDatasets.find.byId(input);
  }),
});

export default draftDatasetFindRouter;
