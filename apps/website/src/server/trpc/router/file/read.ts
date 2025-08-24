import { z } from "zod";

import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset";

export const fileReadRouter = router({
  readBytes: datasetAccessProcedure
    .input(
      z.object({ key: z.string(), cursor: z.number().nullish(), take: z.number().max(65_536) }),
    )
    .query(async ({ input, ctx }) =>
      service.file.read.readBytes({
        skipBytes: input.cursor ?? 0,
        takeBytes: input.take,
        key: `${ctx.dataset.id}/${ctx.dataset.slug}/${input.key}`,
      }),
    ),
});
