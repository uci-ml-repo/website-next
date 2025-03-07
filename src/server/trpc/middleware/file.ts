import * as process from "node:process";

import { initTRPC, TRPCError } from "@trpc/server";
import fs from "fs-extra";
import transformer from "superjson";
import { z } from "zod";

import { absoluteStaticPath } from "@/lib/utils/file";
import type { createContext } from "@/server/trpc/context";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

const t = initTRPC.context<typeof createContext>().create({ transformer });

export const fileAccessProcedure = t.procedure
  .input(z.object({ path: z.string().optional() }))
  .use(async ({ ctx, input, next }) => {
    if (!process.env.STATIC_FILES_DIRECTORY) {
      throw new Error("No STATIC_FILES_DIRECTORY defined");
    }

    if (!input.path) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "No path provided" });
    }

    let realAccessPath: string;
    try {
      realAccessPath = fs.realpathSync(absoluteStaticPath(input.path));
    } catch {
      throw new TRPCError({ code: "NOT_FOUND", message: input.path });
    }

    const realStaticFilesRoot = fs.realpathSync(
      process.env.STATIC_FILES_DIRECTORY,
    );

    if (!realAccessPath.startsWith(realStaticFilesRoot)) {
      throw new TRPCError({ code: "BAD_REQUEST", message: input.path });
    }

    if (realAccessPath.startsWith(`${realStaticFilesRoot}/private`)) {
      if (!ctx.session?.user.role) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: input.path });
      }

      if (!isPriviliged(ctx.session.user.role)) {
        throw new TRPCError({ code: "FORBIDDEN", message: input.path });
      }
    }

    return next({
      ctx: {
        absolutePath: realAccessPath,
      },
    });
  });
