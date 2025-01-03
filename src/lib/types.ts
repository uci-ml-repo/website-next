import type { RouterOutput } from "@/server/trpc/routers";

export type DatasetResponse = NonNullable<
  RouterOutput["datasets"]["find"]["byId"]
>;

export type DraftDatasetResponse = NonNullable<
  RouterOutput["drafts"]["find"]["byId"]
>;

export type DiscussionResponse = NonNullable<
  RouterOutput["discussions"]["find"]["byId"]
>;

export type BookmarkResponse = NonNullable<
  RouterOutput["bookmarks"]["find"]["byUserId"][number]
>;

export type FileResponse = NonNullable<
  RouterOutput["files"]["find"]["list"][number]
>;
