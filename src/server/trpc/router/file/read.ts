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
    .query(({ ctx, input }) =>
      service.file.read.readFile({
        ...input,
        absolutePath: ctx.realPath,
      }),
    ),

  stats: fileAccessProcedure
    .input(z.object({ path: z.string() }))
    .query(({ ctx }) =>
      service.file.read.stats({
        absolutePath: ctx.realPath,
      }),
    ),

  zipStats: fileAccessProcedure
    .input(z.object({ path: z.string() }))
    .query(({ ctx }) =>
      service.file.read.zipStats({
        absolutePath: ctx.realPath,
      }),
    ),

  checksum: fileAccessProcedure
    .input(z.object({ path: z.string() }))
    .query(({ ctx }) =>
      service.file.read.checksum({
        absolutePath: ctx.realPath,
      }),
    ),
});
