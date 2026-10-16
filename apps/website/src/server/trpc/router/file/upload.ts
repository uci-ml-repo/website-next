import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { authenticatedProcedure } from "@/server/trpc/middleware/authenticated";
import {
  completeDatasetArchiveUpload,
  datasetArchiveUpload,
} from "@/server/types/dataset/donation";

export const fileUploadRouter = router({
  start: authenticatedProcedure
    .input(datasetArchiveUpload)
    .mutation(({ ctx, input }) => service.file.upload.start(ctx.session.user.id, input)),
  complete: authenticatedProcedure
    .input(completeDatasetArchiveUpload)
    .mutation(({ ctx, input }) =>
      service.file.upload.complete(ctx.session.user.id, input.datasetId, input.key),
    ),
});
