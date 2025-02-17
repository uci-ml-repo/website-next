import { z } from "zod";

import { datasetQuery } from "@/server/schema/dataset";
import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const variableFindRouter = router({
  remainingFilters: procedure
    .input(
      z.object({
        attributeFilters: z.string().array(),
        query: datasetQuery.optional(),
      }),
    )
    .query(async ({ input }) => {
      return service.attribute.find.remainingFilters(input);
    }),
});
