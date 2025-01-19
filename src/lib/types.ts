import type { AcceptedDatasetSelect } from "@/db/types";
import type { RouterOutput } from "@/server/trpc/routers";

export type DatasetResponse = NonNullable<
  RouterOutput["datasets"]["find"]["byId"]
>;

export type AcceptedDatasetResponse = DatasetResponse & AcceptedDatasetSelect;

export type DiscussionResponse = NonNullable<
  RouterOutput["discussions"]["find"]["byId"]
>;

export type BookmarkResponse = NonNullable<
  RouterOutput["bookmarks"]["find"]["byUserId"][number]
>;

export type FileResponse = NonNullable<
  RouterOutput["files"]["find"]["list"][number]
>;
