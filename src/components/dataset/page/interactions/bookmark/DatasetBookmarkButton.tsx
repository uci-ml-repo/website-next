import { auth } from "@/auth";
import DatasetAuthorizedBookmarkButton from "@/components/dataset/page/interactions/bookmark/DatasetAuthorizedBookmarkButton";
import DatasetUnauthorizedBookmarkButton from "@/components/dataset/page/interactions/bookmark/DatasetUnauthorizedBookmarkButton";
import type { DatasetResponse } from "@/lib/types";
import { caller } from "@/server/trpc/query/server";

export default async function DatasetBookmarkButton({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const session = await auth();

  if (!session?.user) {
    return <DatasetUnauthorizedBookmarkButton />;
  }

  const bookmarked = await caller.datasets.bookmarks.isBookmarked(dataset.id);

  return (
    <DatasetAuthorizedBookmarkButton
      dataset={dataset}
      bookmarked={bookmarked}
    />
  );
}
