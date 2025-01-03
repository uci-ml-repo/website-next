import { z } from "zod";

import service from "@/server/service";
import { fileAccessProcedure, router } from "@/server/trpc";

const filesReadRouter = router({
  readFile: fileAccessProcedure
    .input(
      z.object({
        path: z.string(),
        cursor: z.number().optional(),
        takeLines: z.number().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return service.files.read.readFile({
        ...input,
        absolutePath: ctx.realPath,
      });
    }),
});

export default filesReadRouter;
