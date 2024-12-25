import { initTRPC, TRPCError } from "@trpc/server";
import transformer from "superjson";

import type { createContext } from "@/server/trpc/context";

const t = initTRPC.context<typeof createContext>().create({ transformer });

export const { procedure, router, middleware, createCallerFactory } = t;

export const protectedProcedure = t.procedure.use(
  async function isAuthed(opts) {
    if (!opts.ctx.session?.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return opts.next({
      ctx: {
        user: opts.ctx.session.user,
      },
    });
  },
);
