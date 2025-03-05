import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

export const reportFindRouter = router({
  countAll: protectedProcedure.query(() => service.report.find.countAll()),
});
