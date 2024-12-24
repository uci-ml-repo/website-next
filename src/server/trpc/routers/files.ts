import z from "zod";

import service from "@/server/service";
import { procedure, router } from "@/server/trpc";

const filesRouter = router({
  findZipMetadata: procedure
    .input(z.object({ id: z.number(), slug: z.string() }))
    .query(async ({ input }) => {
      return service.files.find.zipMetadata(input);
    }),
});

export default filesRouter;
