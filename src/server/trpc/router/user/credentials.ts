import { z } from "zod";

import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const userCredentialsRouter = router({
  passwordReset: procedure
    .input(z.object({ email: z.string() }))
    .mutation(async ({ input }) => {
      return service.user.credentials.passwordReset({
        email: input.email,
      });
    }),
});

export default userCredentialsRouter;
