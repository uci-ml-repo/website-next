import { initTRPC } from "@trpc/server";
import type { createContext } from "@website/server/trpc/context";
import transformer from "superjson";

const t = initTRPC.context<typeof createContext>().create({ transformer });

export const { procedure, router, middleware, createCallerFactory } = t;
