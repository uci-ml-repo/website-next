import z from "zod";

import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

export const bookmarkRemoveRouter = router({
  removeBookmark: protectedProcedure
    .input(z.object({ datasetId: z.number() }))
    .mutation(({ input, ctx }) =>
      service.bookmark.remove.removeBookmark({
        datasetId: input.datasetId,
        userId: ctx.user.id,
      }),
    ),
});
