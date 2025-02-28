import { z } from "zod";

import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

export const datasetCreateRouter = router({
  draft: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(({ input, ctx }) =>
      service.dataset.create.draft({ ...input, userId: ctx.user.id }),
    ),
});
