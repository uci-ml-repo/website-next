import { initTRPC } from "@trpc/server";
import transformer from "superjson";

import type { createContext } from "@/server/trpc/context";

const t = initTRPC.context<typeof createContext>().create({ transformer });

export const { procedure, router, middleware, createCallerFactory } = t;
