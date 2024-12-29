import { z } from "zod";

import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const discussionsEditRouter = router({
  byId: procedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input }) => {
      return service.discussions.edit.byId(input);
    }),
});

export default discussionsEditRouter;
