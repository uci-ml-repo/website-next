import type { RouterOutput } from "@/server/trpc/router";

export type DatasetSelect = RouterOutput["dataset"]["find"]["byQuery"]["datasets"][number];
