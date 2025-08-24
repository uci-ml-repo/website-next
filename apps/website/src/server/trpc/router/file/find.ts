import { TRPCError } from "@trpc/server";

import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset";

export const fileFindRouter = router({
  list: datasetAccessProcedure.query(async ({ ctx }) => {
    const list = await service.file.find.list({ id: ctx.dataset.id, slug: ctx.dataset.slug });

    if (list === undefined) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    return list;
  }),
});
