import type { RouterOutput } from "@/server/trpc/router";

export type DatasetFull = RouterOutput["dataset"]["find"]["byId"];
