import { userQuery } from "@/server/schema/user";
import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

export const userFindRouter = router({
  byQuery: protectedProcedure
    .meta({
      requireRoles: [MiddlewareRoles.ADMIN],
    })
    .input(userQuery)
    .query(({ input }) => service.user.find.byQuery(input)),

  countByQuery: protectedProcedure
    .meta({
      requireRoles: [MiddlewareRoles.ADMIN],
    })
    .input(userQuery)
    .query(({ input }) => service.user.find.countByQuery(input)),
});
