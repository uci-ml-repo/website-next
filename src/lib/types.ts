import type { AcceptedDatasetRequiredFields } from "@/db/lib/types";
import type { RequireNonNullable } from "@/lib/utils";
import type { RouterOutput } from "@/server/trpc/router";

export type DatasetResponse = NonNullable<
  RouterOutput["dataset"]["find"]["byId"]
>;

export type DatasetPreviewResponse = NonNullable<
  RouterOutput["dataset"]["find"]["byQuery"]["datasets"][number]
>;

export type DatasetQueryResponse = NonNullable<
  RouterOutput["dataset"]["find"]["byQuery"]
>;

export type AcceptedDatasetResponse = RequireNonNullable<
  DatasetResponse,
  AcceptedDatasetRequiredFields
>;

export type DiscussionResponse = NonNullable<
  RouterOutput["discussion"]["find"]["byId"]
>;

export type DiscussionCommentResponse = NonNullable<
  RouterOutput["discussion"]["comment"]["find"]["byId"]
>;
