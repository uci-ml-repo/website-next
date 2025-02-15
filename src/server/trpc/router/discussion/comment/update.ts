import { z } from "zod";

import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

export const discussionCommentUpdateRouter = router({
  byId: protectedProcedure
    .meta({ requireRoles: ["COMMENT_AUTHOR"] })
    .input(z.object({ id: z.string(), content: z.string() }))
    .mutation(async ({ input }) => {
      return service.discussion.comment.update.byId(input);
    }),
});
