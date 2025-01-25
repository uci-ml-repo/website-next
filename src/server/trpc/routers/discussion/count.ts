import { z } from "zod";

import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const discussionCountRouter = router({
  byDatasetId: procedure.input(z.number()).query(async ({ input }) => {
    return service.discussion.count.byDatasetId(input);
  }),
});

export default discussionCountRouter;
