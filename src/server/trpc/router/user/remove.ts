import { z } from "zod";

import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

export const userRemoveRouter = router({
  byId: protectedProcedure
    .meta({ requireRoles: [MiddlewareRoles.IS_USER_ID] })
    .input(z.object({ userId: z.string() }))
    .mutation(({ input }) => service.user.remove.byId(input)),
});
