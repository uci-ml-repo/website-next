import { z } from "zod";

import { Enums } from "@/db/lib/enums";
import { enumToArray } from "@/lib/utils";
import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";
import { MiddlewareRoles } from "@/server/trpc/middleware/lib/roles";

export const userUpdateRouter = router({
  role: protectedProcedure
    .meta([MiddlewareRoles.ADMIN])
    .input(
      z.object({
        userId: z.string().uuid(),
        role: z.enum(enumToArray(Enums.UserRole)),
      }),
    )
    .mutation(({ input }) => service.user.update.role(input)),
});
