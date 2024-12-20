import type { RouterOutput } from "@/server/trpc/routers";

export type DatasetResult = RouterOutput["datasets"]["findById"];
