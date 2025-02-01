"use client";

import { SearchIcon, Undo2Icon } from "lucide-react";
import React, { useState } from "react";

import DiscussionCreateButton from "@/components/discussion/create/DiscussionCreateButton";
import DiscussionsOrderBy from "@/components/discussion/DiscussionsOrderBy";
import DiscussionPreview from "@/components/discussion/preview/DiscussionPreview";
import useInfiniteScroll from "@/components/hooks/use-infinite-scroll";
import { Button } from "@/components/ui/button";
import { InputClearable } from "@/components/ui/input-clearable";
import Spinner from "@/components/ui/spinner";
import { trpc } from "@/server/trpc/query/client";

export type DiscussionsOrderBy = "top" | "new";

export default function Discussions({
  datasetId,
  userId,
  allowCreate,
}: {
  datasetId?: number;
  userId?: string;
  allowCreate?: boolean;
}) {
  const [orderBy, setOrderBy] = useState<"top" | "new">("top");
  const [searchValue, setSearchValue] = useState<string>("");

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.discussion.find.byQuery.useInfiniteQuery(
      {
        datasetId: datasetId,
        userId: userId,
        search: searchValue,
        order:
          orderBy === "top"
            ? { upvoteCount: "desc", createdAt: "desc" }
            : { createdAt: "desc" },
        limit: 10,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const discussions = data?.pages.flatMap((page) => page.discussions) || [];
  const loadMoreRef = useInfiniteScroll({
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
            value={searchValue}
            setValue={setSearchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="max-sm: flex justify-between gap-4 max-sm:w-full max-sm:flex-row-reverse">
          <DiscussionsOrderBy
            orderBy={orderBy}
            setOrderBy={setOrderBy}
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
          <Button variant="secondary" onClick={() => setSearchValue("")}>
            Clear search <Undo2Icon />
          </Button>
        </div>
      ) : (
        <div>
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

      <div ref={loadMoreRef} />

      {isFetchingNextPage && (
        <div className="flex h-12 items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
