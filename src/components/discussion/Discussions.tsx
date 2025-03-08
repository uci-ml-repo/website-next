"use client";

import { ChevronDownIcon, SearchIcon, Undo2Icon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import { DiscussionCreateButton } from "@/components/discussion/create/DiscussionCreateButton";
import { DiscussionsOrderBy } from "@/components/discussion/DiscussionsOrderBy";
import { DiscussionPreview } from "@/components/discussion/preview/DiscussionPreview";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import { useInfinitePagination } from "@/components/hooks/use-infinite-pagination";
import { BackToTop } from "@/components/ui/back-to-top";
import { Button } from "@/components/ui/button";
import { AlternativeCard } from "@/components/ui/card";
import { InputClearable } from "@/components/ui/input-clearable";
import { Spinner } from "@/components/ui/spinner";
import { DATASETS_ROUTE } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export function Discussions({
  datasetId,
  userId,
  allowCreate,
  initialHasDiscussions,
}: {
  datasetId?: number;
  userId?: string;
  allowCreate?: boolean;
  initialHasDiscussions?: boolean;
}) {
  const [orderBy, setOrderBy] = useState("top");

  const { inputValue, setInputValue, searchValue, handleChange, clearSearch } =
    useDebouncedSearch();

  useEffect(() => {
    if (searchValue) {
      setOrderBy("relevance");
    }
  }, [searchValue]);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.discussion.find.byQuery.useInfiniteQuery(
      {
        datasetId,
        userId,
        search: searchValue,
        order:
          orderBy === "top"
            ? { upvoteCount: "desc", createdAt: "desc" }
            : { createdAt: "desc" },
        limit: 15,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        staleTime: 0,
        refetchOnMount: true,
      },
    );

  const discussionsCount = data?.pages[0] ? data?.pages[0].count : 0;

  const hasDiscussions =
    discussionsCount === undefined
      ? initialHasDiscussions
      : discussionsCount > 0;

  const discussions = data?.pages.flatMap((page) => page.discussions) || [];

  const { triggerFetchNextPage } = useInfinitePagination({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return hasDiscussions ? (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <div className="w-full">
          <InputClearable
            icon={SearchIcon}
            placeholder="Search discussions"
            aria-label="Search discussions"
            value={inputValue}
            setValue={setInputValue}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between gap-4 max-md:w-full max-md:flex-row-reverse">
          <DiscussionsOrderBy
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            clearSearch={clearSearch}
            className="flex justify-end"
          />
          {allowCreate && discussions.length && (
            <DiscussionCreateButton tooltip />
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-20 w-full items-center justify-center">
          <Spinner className="size-10" />
        </div>
      ) : discussions.length === 0 ? (
        <div className="flex h-20 flex-col items-center justify-center space-y-2">
          <div className="text-muted-foreground">No discussions found</div>
          <Button variant="secondary" onClick={clearSearch}>
            Clear search <Undo2Icon />
          </Button>
        </div>
      ) : (
        <div className="w-full">
          {searchValue && data && (
            <div className="text-lg text-muted-foreground">
              Found {discussionsCount.toLocaleString()}{" "}
              {discussionsCount === 1 ? "discussion" : "discussions"} for '
              {searchValue}'
            </div>
          )}
          {discussions.map((discussion) => (
            <React.Fragment key={discussion.id}>
              <DiscussionPreview
                discussion={discussion}
                showDatasetTitle={!!userId}
              />
              <hr />
            </React.Fragment>
          ))}
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
        {discussions.length > 10 && <BackToTop />}
      </div>
    </div>
  ) : userId ? (
    <AlternativeCard>
      <div className="text-muted-foreground">
        You have not created any discussions yet.
      </div>
      <Button variant="gold" asChild className="lift">
        <Link href={DATASETS_ROUTE}>
          <SearchIcon /> Find datasets to discuss
        </Link>
      </Button>
    </AlternativeCard>
  ) : (
    <AlternativeCard>
      <div className="space-y-3 text-center">
        <div className="text-muted-foreground">
          There are no discussions yet. Be the first to discuss this dataset!
        </div>
        <DiscussionCreateButton />
      </div>
    </AlternativeCard>
  );
}
