import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { cache } from "react";

import { createCallerFactory } from "..";
import { createContext } from "../context";
import { appRouter } from "../router";
import { makeQueryClient } from "./query-client";

export const getQueryClient = cache(makeQueryClient);

export const { trpc, HydrateClient } = createHydrationHelpers<typeof appRouter>(
  createCallerFactory(appRouter)(createContext),
  getQueryClient,
);
