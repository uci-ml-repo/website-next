import { service } from "@website/server/service";
import { procedure, router } from "@website/server/trpc";
import { z } from "zod";

export const userFindRouter = router({
  byId: procedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => service.user.find.byId(input.id)),
});
