import { z } from "zod";

import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const discussionsFindRouter = router({
  byId: procedure.input(z.string()).query(async ({ input }) => {
    return service.discussions.find.byId(input);
  }),
});

export default discussionsFindRouter;
