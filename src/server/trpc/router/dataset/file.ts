import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { datasetAccessProcedure } from "@/server/trpc/middleware/dataset-access";

export const datasetFileRouter = router({
  zipStatuses: datasetAccessProcedure.query(({ ctx }) =>
    service.dataset.file.zipStatuses(ctx.dataset),
  ),
});
