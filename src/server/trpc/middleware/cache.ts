import { procedure } from "@/server/trpc";

/**
 * A tRPC middleware that caches responses in Redis.
 */
export const cachedProcedure = procedure.use;
