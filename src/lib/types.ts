import type { RouterOutput } from "@/server/trpc/routers";

export type Dataset = NonNullable<RouterOutput["datasets"]["findById"]>;
