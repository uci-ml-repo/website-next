import { auth } from "@/auth";
import type { DatasetResponse } from "@/lib/types";
import { caller } from "@/server/trpc/server";

export default async function DatasetBookmarkButton({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const session = await auth();

  if (!session?.user) {
    return <></>;
  }

  const isBookmarked = caller.dataset.bookmarks.isBookmarked(dataset.id);

  return <></>;
}
