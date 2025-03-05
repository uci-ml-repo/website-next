import { editQuery } from "@/server/schema/edit";
import { service } from "@/server/service";
import { protectedProcedure, router } from "@/server/trpc";
import { PRIVILEGED_ROLES } from "@/server/trpc/middleware/lib/roles";

export const editFindRouter = router({
  byQuery: protectedProcedure
    .meta(PRIVILEGED_ROLES)
    .input(editQuery)
    .query(({ input }) => service.edit.find.byQuery(input)),

  countByQuery: protectedProcedure
    .meta(PRIVILEGED_ROLES)
    .input(editQuery)
    .query(({ input }) => service.edit.find.countByQuery(input)),
});
