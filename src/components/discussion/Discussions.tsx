"use client";

import { SearchIcon } from "lucide-react";
import React, { useState } from "react";

import DiscussionCreateButton from "@/components/discussion/create/DiscussionCreateButton";
import DiscussionsOrderBy from "@/components/discussion/DiscussionsOrderBy";
import DiscussionPreview from "@/components/discussion/preview/DiscussionPreview";
import useInfiniteScroll from "@/components/hooks/use-infinite-scroll";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    trpc.discussion.find.byQuery.useInfiniteQuery(
      {
        datasetId: datasetId,
        userId: userId,
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

  if (isLoading) {
    return (
      <div className="flex h-20 w-full items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {discussions.length === 0 ? (
        <Card className="w-full">
          <CardContent className="flex h-[130px] items-center justify-center">
            <div className="space-y-3 text-center">
              <div className="text-muted-foreground">
                There are no discussions yet
              </div>
              {allowCreate && <DiscussionCreateButton />}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="w-full">
            <Input icon={SearchIcon} placeholder="Search Discussions" />
          </div>

          <div className="max-sm: flex justify-between gap-4 max-sm:w-full max-sm:flex-row-reverse">
            <DiscussionsOrderBy
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              className="flex justify-end"
            />
            {allowCreate && <DiscussionCreateButton />}
          </div>
        </div>
      )}

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

      <div ref={loadMoreRef} />

      {isFetchingNextPage && (
        <div className="flex h-12 items-center justify-center">
          <Spinner />
        </div>
      )}
    </div>
  );
}
