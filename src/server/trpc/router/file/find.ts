import { z } from "zod";

import service from "@/server/service";
import { fileAccessProcedure, router } from "@/server/trpc";

const fileFindRouter = router({
  list: fileAccessProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ ctx }) => {
      return service.file.find.list(ctx.realPath);
    }),

  search: fileAccessProcedure
    .input(z.object({ path: z.string(), search: z.string() }))
    .query(async ({ ctx, input }) => {
      return service.file.find.search(ctx.realPath, input.search);
    }),
});

export default fileFindRouter;
