import { z } from "zod";

import service from "@/server/service";
import { procedure, protectedProcedure, router } from "@/server/trpc";

const datasetBookmarkRouter = router({
  byUserId: procedure.input(z.string()).query(async ({ input }) => {
    return service.datasets.bookmark.byUserId(input);
  }),

  addBookmark: protectedProcedure
    .input(z.object({ datasetId: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      return service.datasets.bookmark.addBookmark({
        datasetId: input.datasetId,
        userId: input.userId,
      });
    }),

  removeBookmark: protectedProcedure
    .input(z.object({ datasetId: z.number(), userId: z.string() }))
    .mutation(async ({ input }) => {
      return service.datasets.bookmark.removeBookmark({
        datasetId: input.datasetId,
        userId: input.userId,
      });
    }),

  isBookmarked: protectedProcedure
    .input(z.object({ datasetId: z.number(), userId: z.string() }))
    .query(async ({ input }) => {
      return service.datasets.bookmark.isBookmarked({
        datasetId: input.datasetId,
        userId: input.userId,
      });
    }),
});

export default datasetBookmarkRouter;
