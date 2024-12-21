import type { RouterOutput } from "@/server/trpc/routers";

export type DatasetResponse = NonNullable<RouterOutput["datasets"]["findById"]>;
