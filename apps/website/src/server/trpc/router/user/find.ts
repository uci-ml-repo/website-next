import { z } from "zod";

import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const userFindRouter = router({
  byId: procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => service.user.find.byId(input.id)),

  byEmail: procedure
    .input(z.object({ email: z.email() }))
    .query(({ input }) => service.user.find.byEmail(input.email)),
});
