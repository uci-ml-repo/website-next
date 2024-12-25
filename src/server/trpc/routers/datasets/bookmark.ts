import { z } from "zod";

import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const datasetBookmarkRouter = router({
  bookmarks: protectedProcedure.query(async ({ ctx }) => {
    return service.datasets.bookmark.bookmarks(ctx.user.id);
  }),

  addBookmark: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return service.datasets.bookmark.addBookmark({
        datasetId: input,
        userId: ctx.user.id,
      });
    }),

  removeBookmark: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return service.datasets.bookmark.removeBookmark({
        datasetId: input,
        userId: ctx.user.id,
      });
    }),

  isBookmarked: protectedProcedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return service.datasets.bookmark.isBookmarked({
        datasetId: input,
        userId: ctx.user.id,
      });
    }),
});

export default datasetBookmarkRouter;
