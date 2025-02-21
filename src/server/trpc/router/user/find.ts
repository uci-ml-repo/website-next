import { userQuery } from "@/server/schema/user";
import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

export const userFindRouter = router({
  countByQuery: protectedProcedure
    .meta({
      requireRoles: [
        MiddlewareRoles.ADMIN,
        MiddlewareRoles.CURATOR,
        MiddlewareRoles.LIBRARIAN,
      ],
    })
    .input(userQuery)
    .query(({ input }) => service.user.find.countByQuery(input)),
});
