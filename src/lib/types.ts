import type { RouterOutput } from "@/server/trpc/routers";

export type DatasetResponse = NonNullable<
  RouterOutput["datasets"]["find"]["byId"]
>;

export type DatasetDiscussionResponse = NonNullable<
  RouterOutput["discussions"]["find"]["byId"]
>;

export type BookmarkResponse = NonNullable<
  RouterOutput["datasets"]["bookmarks"]["byUserId"][number]
>;
