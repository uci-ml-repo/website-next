import { z } from "zod";

import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const discussionUpdateRouter = router({
  byId: procedure
    .input(z.object({ id: z.string(), title: z.string(), content: z.string() }))
    .mutation(({ input }) => service.discussion.update.byId(input)),
});
