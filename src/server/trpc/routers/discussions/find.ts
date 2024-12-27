import { z } from "zod";

import { discussionQuery } from "@/server/schema/discussions";
import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const discussionsFindRouter = router({
  byId: procedure.input(z.string()).query(async ({ input }) => {
    return service.discussions.find.byId(input);
  }),

  byQuery: procedure.input(discussionQuery).query(async ({ input }) => {
    return service.discussions.find.byQuery(input);
  }),
});

export default discussionsFindRouter;
