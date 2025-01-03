import { z } from "zod";

import service from "@/server/service";
import { fileAccessProcedure, router } from "@/server/trpc";

const filesReadRouter = router({
  readFileInfinite: fileAccessProcedure
    .input(
      z.object({
        path: z.string(),
        cursor: z.number().optional(),
        takeLines: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return service.files.read.readFileInfinite({
        ...input,
        absolutePath: ctx.realPath,
      });
    }),

  stats: fileAccessProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ ctx }) => {
      return service.files.read.stats({
        absolutePath: ctx.realPath,
      });
    }),

  zipStats: fileAccessProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ ctx }) => {
      return service.files.read.zipStats({
        absolutePath: ctx.realPath,
      });
    }),
});

export default filesReadRouter;
