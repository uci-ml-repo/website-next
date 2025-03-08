import type { RouterOutput } from "@/server/trpc/router";

export type DatasetResponse = NonNullable<
  RouterOutput["dataset"]["find"]["byId"]
>;

export type DatasetPreviewResponse = NonNullable<
  RouterOutput["dataset"]["find"]["byQuery"]["datasets"][number]
>;

export type DiscussionResponse = NonNullable<
  RouterOutput["discussion"]["find"]["byId"]
>;

export type DiscussionCommentResponse = NonNullable<
  RouterOutput["discussion"]["comment"]["find"]["byId"]
>;

export type ReportCountResponse = NonNullable<
  RouterOutput["report"]["find"]["countAll"]
>;
