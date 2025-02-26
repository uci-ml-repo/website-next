import { z } from "zod";

import { service } from "@/server/service";
import { fileAccessProcedure, router } from "@/server/trpc";

export const fileFindRouter = router({
  list: fileAccessProcedure
    .input(z.object({ path: z.string() }))
    .query(({ ctx }) => service.file.find.list(ctx.realPath)),

  search: fileAccessProcedure
    .input(z.object({ path: z.string(), search: z.string() }))
    .query(({ ctx, input }) =>
      service.file.find.search(ctx.realPath, input.search),
    ),
});
