import type { createContext } from "@server/trpc/context";
import { initTRPC } from "@trpc/server";
import transformer from "superjson";

const t = initTRPC.context<typeof createContext>().create({ transformer });

export const { procedure, router, middleware, createCallerFactory } = t;
