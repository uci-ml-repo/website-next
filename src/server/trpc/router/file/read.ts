import { z } from "zod";

import { service } from "@/server/service";
import { fileAccessProcedure, router } from "@/server/trpc";

export const fileReadRouter = router({
  readFileInfinite: fileAccessProcedure
    .input(
      z.object({
        path: z.string(),
        cursor: z.number().optional(),
        takeLines: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return service.file.read.readFileInfinite({
        ...input,
        absolutePath: ctx.realPath,
      });
    }),

  stats: fileAccessProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ ctx }) => {
      return service.file.read.stats({
        absolutePath: ctx.realPath,
      });
    }),

  zipStats: fileAccessProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ ctx }) => {
      return service.file.read.zipStats({
        absolutePath: ctx.realPath,
      });
    }),
});
