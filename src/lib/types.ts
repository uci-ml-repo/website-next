import type { AcceptedDatasetRequiredFields } from "@/db/types";
import type { RequireNonNullable } from "@/lib/utils";
import type { RouterOutput } from "@/server/trpc/routers";

export type DatasetResponse = NonNullable<
  RouterOutput["dataset"]["find"]["byId"]
>;

export type AcceptedDatasetResponse = RequireNonNullable<
  DatasetResponse,
  AcceptedDatasetRequiredFields
>;

export type DiscussionResponse = NonNullable<
  RouterOutput["discussion"]["find"]["byId"]
>;

export type BookmarkResponse = NonNullable<
  RouterOutput["bookmark"]["find"]["byUserId"][number]
>;

export type FileResponse = NonNullable<
  RouterOutput["file"]["find"]["list"][number]
>;
