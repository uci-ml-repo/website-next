import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";

import { createCallerFactory } from "@/server/trpc";
import { createContext } from "@/server/trpc/context";
import { makeQueryClient } from "@/server/trpc/query/query-client";
import { appRouter } from "@/server/trpc/routers";

const getQueryClient = cache(makeQueryClient);

export const caller = createCallerFactory(appRouter)(createContext);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  caller,
  getQueryClient,
);
