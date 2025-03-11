"use client";

import {
  BookmarkIcon,
  ChevronDownIcon,
  SearchIcon,
  Undo2Icon,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { DatasetRow } from "@/components/dataset/preview/DatasetRow";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { useInfinitePagination } from "@/components/hooks/use-infinite-pagination";
import { BackToTop } from "@/components/ui/back-to-top";
import { Button } from "@/components/ui/button";
import { AlternativeCard } from "@/components/ui/card";
import { InputClearable } from "@/components/ui/input-clearable";
import { Spinner } from "@/components/ui/spinner";
import { TabHeader } from "@/components/ui/tab-header";
import { DATASETS_ROUTE } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export default function Page() {
  const { inputValue, setInputValue, searchValue, handleChange, clearSearch } =
    useDebouncedSearch();

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

  const { triggerFetchNextPage } = useInfinitePagination({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <div className="space-y-4">
      <TabHeader
        title="Bookmarks"
        icon={BookmarkIcon}
        className="[&>svg]:fill-uci-gold"
      />
      {!isLoading && !(data && data.pages[0].bookmarks.length > 0) ? (
        <AlternativeCard>
          <div className="text-muted-foreground">
            Visit a dataset and click the bookmark button (
            <BookmarkIcon className="mb-0.5 inline size-5" />) to save it here.
          </div>
          <Button variant="gold" className="lift" asChild>
            <Link href={DATASETS_ROUTE}>
              <SearchIcon /> Find datasets to bookmark
            </Link>
          </Button>
        </AlternativeCard>
      ) : (
        <>
          {data && data.pages[0].bookmarks.length > 0 && (
            <InputClearable
              variantSize="lg"
              placeholder="Search bookmarks"
              icon={SearchIcon}
              value={inputValue}
              setValue={setInputValue}
              onChange={handleChange}
            />
          )}
          {isLoading ? (
            <div className="flex h-20 w-full items-center justify-center">
              <Spinner className="size-10" />
            </div>
          ) : bookmarks.length > 0 ? (
            <>
              {inputValue && (
                <div className="text-lg text-muted-foreground">
                  Found {bookmarks.length.toLocaleString()}
                  {hasNextPage && "+"}{" "}
                  {bookmarks.length === 1
                    ? "bookmarked dataset"
                    : "bookmarked datasets"}{" "}
                  for '{searchValue}'
                </div>
              )}

              <div className="relative divide-y">
                {bookmarks.map((bookmark) => (
                  <DatasetRow
                    hoverCard
                    dataset={bookmark.dataset}
                    key={bookmark.dataset.id}
                  />
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
