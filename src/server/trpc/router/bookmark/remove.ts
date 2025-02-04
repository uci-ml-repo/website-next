import z from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const bookmarkRemoveRouter = router({
  removeBookmark: protectedProcedure
    .input(z.object({ datasetId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      return service.bookmark.remove.removeBookmark({
        datasetId: input.datasetId,
        userId: ctx.user.id,
      });
    }),
});

export default bookmarkRemoveRouter;
