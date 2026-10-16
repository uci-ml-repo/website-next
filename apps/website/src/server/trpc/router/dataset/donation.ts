import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { authenticatedProcedure } from "@/server/trpc/middleware/authenticated";
import {
  createDatasetDraft,
  submitDatasetDraft,
  updateDatasetDraft,
} from "@/server/types/dataset/donation";

export const datasetDonationRouter = router({
  create: authenticatedProcedure
    .input(createDatasetDraft)
    .mutation(({ ctx, input }) => service.dataset.donation.create(ctx.session.user.id, input)),

  save: authenticatedProcedure
    .input(updateDatasetDraft)
    .mutation(({ ctx, input }) =>
      service.dataset.donation.save(ctx.session.user.id, input.datasetId, input.fields),
    ),

  submit: authenticatedProcedure
    .input(submitDatasetDraft)
    .mutation(({ ctx, input }) =>
      service.dataset.donation.submit(ctx.session.user.id, input.datasetId, input.fields),
    ),
});
