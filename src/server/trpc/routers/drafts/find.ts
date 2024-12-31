import { z } from "zod";

import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const draftDatasetFindRouter = router({
  byId: procedure.input(z.string()).query(async ({ input }) => {
    return service.drafts.find.byId(input);
  }),

  byUserId: procedure.input(z.string()).query(async ({ input }) => {
    return service.drafts.find.byUserId(input);
  }),
});

export default draftDatasetFindRouter;
