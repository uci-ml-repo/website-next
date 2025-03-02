import { BookmarkIcon, SearchIcon } from "lucide-react";

import { DatasetMiniRow } from "@/components/dataset/preview/DatasetMiniRow";
import {
  OverviewCard,
  OverviewCardAlternativeButton,
  OverviewCardViewMore,
} from "@/components/ui/overview-card";
import { DATASETS_ROUTE, PROFILE_BOOKMARKS_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export async function ProfileBookmarksOverview() {
  const bookmarksQuery = await caller.bookmark.find.byUserQuery({
    limit: 3,
  });

  const bookmarkCount = bookmarksQuery.count;

  return (
    <OverviewCard
      title="Bookmarks"
      icon={<BookmarkIcon className="size-5 fill-uci-gold" />}
      href={PROFILE_BOOKMARKS_ROUTE}
    >
      {bookmarkCount > 0 ? (
        <>
          <div>
            {bookmarksQuery.bookmarks.map((datasetBookmark) => (
              <DatasetMiniRow
                key={datasetBookmark.bookmark.id}
                dataset={datasetBookmark.dataset}
                className="lift"
              />
            ))}
          </div>

          <OverviewCardViewMore
            href={PROFILE_BOOKMARKS_ROUTE}
            text={
              bookmarkCount > 3
                ? `View all ${bookmarkCount} bookmarks`
                : "View all bookmarks"
            }
          />
        </>
      ) : (
        <OverviewCardAlternativeButton
          href={DATASETS_ROUTE}
          description="You have no bookmarks"
          buttonText="Find datasets to bookmark"
          buttonIcon={<SearchIcon />}
        />
      )}
    </OverviewCard>
  );
}
