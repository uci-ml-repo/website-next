import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset";
import { userAccessProcedure } from "@/server/trpc/middleware/user";

export const bookmarkInsertRouter = router({
  addBookmark: userAccessProcedure
    .concat(datasetAccessProcedure)
    .mutation(async ({ input }) => service.bookmark.insert.addBookmark(input)),
});
