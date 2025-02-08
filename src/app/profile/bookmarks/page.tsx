"use client";

import {
  BookmarkIcon,
  ChevronDownIcon,
  SearchIcon,
  Undo2Icon,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import DatasetRow from "@/components/dataset/preview/DatasetRow";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { useInfiniteScroll } from "@/components/hooks/use-infinite-scroll";
import BackToTop from "@/components/ui/back-to-top";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputClearable } from "@/components/ui/input-clearable";
import Spinner from "@/components/ui/spinner";
import { DATASETS_ROUTE } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export default function Page() {
  const { inputValue, setInputValue, searchValue, handleChange, clearSearch } =
    useDebouncedSearch();

  const [hasBookmarks, setHasBookmarks] = useState(false);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.bookmark.find.byUserQuery.useInfiniteQuery(
      {
        search: searchValue || undefined,
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const bookmarks = data?.pages.flatMap((page) => page.bookmarks) || [];

  useEffect(() => {
    if (data && !hasBookmarks) {
      setHasBookmarks(data.pages[0].bookmarks.length > 0);
    }
  }, [data, hasBookmarks]);

  const { triggerFetchNextPage } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <BookmarkIcon className="size-6 fill-uci-gold sm:size-7" />
        <h2 className="text-2xl font-bold">Bookmarks</h2>
      </div>

      {!isLoading && !hasBookmarks ? (
        <Card className="w-full bg-muted">
          <CardContent className="flex h-28 flex-col items-center justify-center space-y-1">
            <div className="text-muted-foreground">
              Visit a dataset and click the bookmark button (
              <BookmarkIcon className="mb-0.5 inline size-5" />) to save it
              here.
            </div>
            <Link href={DATASETS_ROUTE} className="underline">
              Find datasets to bookmark
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <InputClearable
            variantSize="lg"
            placeholder="Search bookmarks"
            icon={SearchIcon}
            value={inputValue}
            setValue={setInputValue}
            onChange={handleChange}
          />

          {isLoading ? (
            <div className="flex h-20 w-full items-center justify-center">
              <Spinner className="size-10" />
            </div>
          ) : bookmarks.length > 0 ? (
            <>
              {inputValue && (
                <div className="text-lg text-muted-foreground">
                  Found {bookmarks.length}
                  {hasNextPage && "+"}{" "}
                  {bookmarks.length === 1
                    ? "bookmarked dataset"
                    : "bookmarked datasets"}{" "}
                  for '{searchValue}'
                </div>
              )}

              <div className="relative">
                {bookmarks.map((bookmark) => (
                  <React.Fragment key={bookmark.dataset_view.id}>
                    <DatasetRow
                      hoverCard
                      dataset={bookmark.dataset_view}
                      className="rounded-none"
                    />
                    <hr />
                  </React.Fragment>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-20 flex-col items-center justify-center space-y-2">
              <div className="text-muted-foreground">
                No bookmarked datasets found
              </div>
              <Button variant="secondary" onClick={clearSearch}>
                Clear search <Undo2Icon />
              </Button>
            </div>
          )}

          {isFetchingNextPage && (
            <div className="flex h-12 items-center justify-center">
              <Spinner />
            </div>
          )}

          <div className="flex items-center justify-between">
            {hasNextPage && !isFetchingNextPage && (
              <Button onClick={triggerFetchNextPage} variant="blue">
                <ChevronDownIcon /> View more
              </Button>
            )}
            {bookmarks.length > 10 && <BackToTop />}
          </div>
        </>
      )}
    </div>
  );
}
