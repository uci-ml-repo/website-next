import { z } from "zod";

import service from "@/server/service";
import {
  discussionQuery,
  discussionSearchQuery,
} from "@/server/service/schema/discussions";
import { procedure, router } from "@/server/trpc";

const discussionFindRouter = router({
  byId: procedure.input(z.string().uuid()).query(async ({ input, ctx }) => {
    return service.discussion.find.byId(input, ctx.session);
  }),

  byQuery: procedure.input(discussionQuery).query(async ({ input, ctx }) => {
    return service.discussion.find.byQuery(input, ctx.session);
  }),

  bySearch: procedure
    .input(discussionSearchQuery)
    .query(async ({ input, ctx }) => {
      return service.discussion.find.bySearch(input, ctx.session);
    }),

  byUserId: procedure.input(z.string().uuid()).query(async ({ input, ctx }) => {
    return service.discussion.find.byUserId(input, ctx.session);
  }),
});

export default discussionFindRouter;
