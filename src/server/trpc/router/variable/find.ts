import { z } from "zod";

import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const variableFindRouter = router({
  remainingFilters: procedure
    .input(z.string().array())
    .query(async ({ input }) => {
      return service.attribute.find.remainingFilters(input);
    }),
});
