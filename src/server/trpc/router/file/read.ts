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
        absolutePath: ctx.absolutePath,
      }),
    ),

  stats: fileAccessProcedure.input(z.object({ path: z.string() })).query(({ ctx }) =>
    service.file.read.stats({
      absolutePath: ctx.absolutePath,
    }),
  ),

  zipStats: fileAccessProcedure.input(z.object({ path: z.string() })).query(({ ctx }) =>
    service.file.read.zipStats({
      absolutePath: ctx.absolutePath,
    }),
  ),

  checksum: fileAccessProcedure.input(z.object({ path: z.string() })).query(({ ctx }) =>
    service.file.read.checksum({
      absolutePath: ctx.absolutePath,
    }),
  ),
});
