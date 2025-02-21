import { z } from "zod";

import { discussionQuery } from "@/server/schema/discussion";
import { service } from "@/server/service";
import { procedure, protectedProcedure, router } from "@/server/trpc";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

export const discussionFindRouter = router({
  byId: procedure.input(z.string().uuid()).query(async ({ input, ctx }) => {
    return service.discussion.find.byId(input, ctx.session);
  }),

  byQuery: procedure.input(discussionQuery).query(async ({ input, ctx }) => {
    return service.discussion.find.byQuery(input, ctx.session);
  }),

  countByQuery: procedure.input(discussionQuery).query(async ({ input }) => {
    return service.discussion.find.countByQuery(input);
  }),

  byUserId: protectedProcedure
    .meta({
      requireRoles: [MiddlewareRoles.ADMIN, MiddlewareRoles.IS_USER_ID],
    })
    .input(z.object({ userId: z.string().uuid() }))
    .query(async ({ input, ctx }) => {
      return service.discussion.find.byUserId({
        userId: input.userId,
        session: ctx.session,
      });
    }),
});
