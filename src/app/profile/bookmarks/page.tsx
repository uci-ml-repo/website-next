"use client";

import { BookmarkIcon, SearchIcon } from "lucide-react";
import React, { useState } from "react";

import DatasetRow from "@/components/dataset/preview/DatasetRow";
import useInfiniteScroll from "@/components/hooks/use-infinite-scroll";
import { Card, CardContent } from "@/components/ui/card";
import { InputClearable } from "@/components/ui/input-clearable";
import Spinner from "@/components/ui/spinner";
import { trpc } from "@/server/trpc/query/client";

export default function Page() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.bookmark.find.byUserQuery.useInfiniteQuery(
      {
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const bookmarks = data?.pages.flatMap((page) => page.bookmarks) || [];

  const loadMoreRef = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <BookmarkIcon className="size-6 fill-uci-gold" />
        <h2 className="text-2xl font-bold">Bookmarks</h2>
      </div>
      {isLoading ? (
        <div className="flex h-20 w-full items-center justify-center">
          <Spinner className="size-10" />
        </div>
      ) : bookmarks.length > 0 ? (
        <>
          <InputClearable
            variantSize="lg"
            placeholder="Search bookmarks"
            icon={SearchIcon}
            value={searchValue}
            setValue={setSearchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <div className="relative">
            {bookmarks.map((bookmark) => (
              <React.Fragment key={bookmark.dataset.id}>
                <DatasetRow
                  hoverCard
                  dataset={bookmark.dataset}
                  className="rounded-none"
                />
                <hr />
              </React.Fragment>
            ))}
          </div>
        </>
      ) : (
        <Card className="flex h-20 items-center justify-center bg-muted text-muted-foreground">
          <CardContent className="text-pretty text-center">
            <span>
              Visit a dataset and click the bookmark button (
              <BookmarkIcon className="mb-0.5 inline size-5" />) to save it
              here.
            </span>
          </CardContent>
        </Card>
      )}

      <div ref={loadMoreRef} />

      {isFetchingNextPage && (
        <div className="flex h-12 items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
