import { service } from "@/server/service";
import { router } from "@/server/trpc";
import { adminProcedure } from "@/server/trpc/middleware/admin";
import { updateUserRole } from "@/server/types/user/request";

export const userUpdateRouter = router({
  role: adminProcedure
    .input(updateUserRole)
    .mutation(({ input }) => service.user.update.role(input)),
});
