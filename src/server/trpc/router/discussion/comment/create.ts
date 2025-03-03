import { z } from "zod";

import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

export const discussionCommentCreateRouter = router({
  fromData: protectedProcedure
    .meta([MiddlewareRoles.VERIFIED])
    .input(
      z.object({
        discussionId: z.string(),
        content: z.string(),
      }),
    )
    .mutation(({ input, ctx }) =>
      service.discussion.comment.create.fromData({
        userId: ctx.user.id,
        ...input,
      }),
    ),
});
