"use client";

import "client-only";

import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, httpLink, splitLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import type { ReactNode } from "react";
import { useState } from "react";
import superjson from "superjson";

import type { AppRouter } from "../router";
import { makeQueryClient } from "./query-client";

export const trpc = createTRPCReact<AppRouter>();

let clientQueryClientSingleton: QueryClient;

function getQueryClient() {
  if (typeof window === "undefined") {
    return makeQueryClient();
  }
  return (clientQueryClientSingleton ??= makeQueryClient());
}

const url = `/api/trpc`;

export function TRPCProvider(
  props: Readonly<{
    children: ReactNode;
  }>,
) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        splitLink({
          condition(op) {
            return Boolean(op.context.skipBatch);
          },
          true: httpLink({
            transformer: superjson,
            url,
          }),
          false: httpBatchLink({
            transformer: superjson,
            url,
          }),
        }),
      ],
    }),
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
    </trpc.Provider>
  );
}
