import { z } from "zod";

import { discussionQuery } from "@/server/schema/discussion";
import { service } from "@/server/service";
import { procedure, router } from "@/server/trpc";

export const discussionFindRouter = router({
  byId: procedure
    .input(z.string().uuid())
    .query(({ input, ctx }) => service.discussion.find.byId(input, ctx.session)),

  byQuery: procedure
    .input(discussionQuery)
    .query(({ input, ctx }) => service.discussion.find.byQuery(input, ctx.session)),

  countByQuery: procedure
    .input(discussionQuery)
    .query(({ input }) => service.discussion.find.countByQuery(input)),
});
