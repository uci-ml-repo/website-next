import { z } from "zod";

import service from "@/server/service";
import { discussionQuery } from "@/server/service/schema/discussions";
import { procedure, router } from "@/server/trpc";

const discussionFindRouter = router({
  byId: procedure.input(z.string()).query(async ({ input }) => {
    return service.discussion.find.byId(input);
  }),

  byQuery: procedure.input(discussionQuery).query(async ({ input }) => {
    return service.discussion.find.byQuery(input);
  }),

  byUserId: procedure.input(z.string()).query(async ({ input }) => {
    return service.discussion.find.byUserId(input);
  }),
});

export default discussionFindRouter;
