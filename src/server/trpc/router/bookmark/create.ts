import { z } from "zod";

import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

export const bookmarkCreateRouter = router({
  addBookmark: protectedProcedure
    .input(z.object({ datasetId: z.number() }))
    .mutation(({ input, ctx }) =>
      service.bookmark.create.addBookmark({
        datasetId: input.datasetId,
        userId: ctx.user.id,
      }),
    ),
});
