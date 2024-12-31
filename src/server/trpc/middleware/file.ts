import * as process from "node:process";

import { initTRPC, TRPCError } from "@trpc/server";
import fs from "fs-extra";
import path from "path";
import transformer from "superjson";
import { z } from "zod";

import type { createContext } from "@/server/trpc/context";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

const t = initTRPC.context<typeof createContext>().create({ transformer });

export const fileAccessProcedure = t.procedure
  .input(z.object({ path: z.string().optional() }))
  .use(async ({ ctx, input, next }) => {
    if (!input.path) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    let realAccessPath: string;
    try {
      realAccessPath = fs.realpathSync(
        path.join(process.env.STATIC_FILES_DIRECTORY!, input.path),
      );
    } catch {
      throw new TRPCError({ code: "NOT_FOUND" });
    }

    const realStaticFilesRoot = fs.realpathSync(
      process.env.STATIC_FILES_DIRECTORY!,
    );

    if (!realAccessPath.startsWith(realStaticFilesRoot)) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    if (realAccessPath.startsWith(`${realStaticFilesRoot}/private`)) {
      if (!ctx.session?.user.role) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }

      if (!isPriviliged(ctx.session.user.role)) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }
    }

    return next({
      ctx: {
        realPath: realAccessPath,
      },
    });
  });
