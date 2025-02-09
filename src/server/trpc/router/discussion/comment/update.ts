import { z } from "zod";

import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const discussionCommentUpdateRouter = router({
  byId: procedure
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input }) => {
      return service.discussion.comment.update.byId(input);
    }),
});
