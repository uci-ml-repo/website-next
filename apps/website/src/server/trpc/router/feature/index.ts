import { router } from "@/server/trpc";
import { featureFindRouter } from "@/server/trpc/router/feature/find";

export const featureRouter = router({
  find: featureFindRouter,
});
