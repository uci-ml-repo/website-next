import { z } from "zod";

import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

export const datasetCreateRouter = router({
  initial: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(({ input, ctx }) =>
      service.dataset.create.initial({ ...input, userId: ctx.user.id }),
    ),
});
