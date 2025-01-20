import { z } from "zod";

import { Enums } from "@/db/enums";
import service from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";

const discussionsRemoveRouter = router({
  byId: protectedProcedure
    .meta({ requireRoles: [Enums.UserRole.ADMIN, "DISCUSSION_AUTHOR"] })
    .input(
      z.object({
        discussionId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      return service.discussions.remove.byId({
        discussionId: input.discussionId,
      });
    }),
});

export default discussionsRemoveRouter;
