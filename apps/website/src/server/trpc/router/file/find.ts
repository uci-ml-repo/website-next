import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset";

export const fileFindRouter = router({
  list: datasetAccessProcedure.input(z.object({ slug: z.string() })).query(async ({ input }) => {
    const list = await service.file.find.list({ id: input.datasetId, slug: input.slug });

    if (list === undefined) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return list;
  }),
});
