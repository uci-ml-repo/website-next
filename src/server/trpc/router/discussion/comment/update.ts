import { z } from "zod";

import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

export const discussionCommentUpdateRouter = router({
  byId: protectedProcedure
    .meta([MiddlewareRoles.COMMENT_AUTHOR])
    .input(z.object({ commentId: z.string(), content: z.string() }))
    .mutation(({ input }) => service.discussion.comment.update.byId(input)),
});
