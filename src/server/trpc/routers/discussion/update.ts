import { z } from "zod";

import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const discussionUpdateRouter = router({
  byId: procedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input }) => {
      return service.discussion.update.byId(input);
    }),
});

export default discussionUpdateRouter;
