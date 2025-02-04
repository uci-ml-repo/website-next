"use client";

import { ChevronDownIcon, SearchIcon, Undo2Icon } from "lucide-react";
import React, { useEffect, useState } from "react";

import DiscussionCreateButton from "@/components/discussion/create/DiscussionCreateButton";
import DiscussionsOrderBy from "@/components/discussion/DiscussionsOrderBy";
import DiscussionPreview from "@/components/discussion/preview/DiscussionPreview";
import { useDebouncedSearch } from "@/components/hooks/use-debounced-search";
import useInfiniteScroll from "@/components/hooks/use-infinite-scroll";
import BackToTop from "@/components/ui/back-to-top";
import { Button } from "@/components/ui/button";
import { InputClearable } from "@/components/ui/input-clearable";
import Spinner from "@/components/ui/spinner";
import { trpc } from "@/server/trpc/query/client";

export default function Discussions({
  datasetId,
  userId,
  allowCreate,
}: {
  datasetId?: number;
  userId?: string;
  allowCreate?: boolean;
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
      { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

  const discussions = data?.pages.flatMap((page) => page.discussions) || [];
  const { triggerFetchNextPage } = useInfiniteScroll({
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row">
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

        <div className="max-sm: flex justify-between gap-4 max-sm:w-full max-sm:flex-row-reverse">
          <DiscussionsOrderBy
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            setSearchValue={clearSearch}
            className="flex justify-end"
          />
          {allowCreate && <DiscussionCreateButton tooltip />}
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
              Found {discussions.length}
              {hasNextPage && "+"}{" "}
              {discussions.length === 1 ? "discussion" : "discussions"} for '
              {searchValue}'
            </div>
          )}
          {discussions.map((discussion) => (
            <React.Fragment key={discussion.id}>
              <DiscussionPreview
                discussion={discussion}
                showOnDataset={!!userId}
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
        {hasNextPage && (
          <Button
            onClick={triggerFetchNextPage}
            variant="blue"
            disabled={isFetchingNextPage}
          >
            <ChevronDownIcon /> View more
          </Button>
        )}
        {discussions.length > 10 && <BackToTop />}
      </div>
    </div>
  );
}
