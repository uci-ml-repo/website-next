import { z } from "zod";

import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";
import { privilegedProcedure } from "@/server/trpc/middleware/privileged";
import { userQuery } from "@/server/types/user/request";

export const userFindRouter = router({
  byId: procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => service.user.find.byId(input.id)),

  byEmail: procedure
    .input(z.object({ email: z.email() }))
    .query(({ input }) => service.user.find.byEmail(input.email)),

  privilegedByQuery: privilegedProcedure
    .input(userQuery)
    .query(({ input }) => service.user.find.byQuery(input)),
});
