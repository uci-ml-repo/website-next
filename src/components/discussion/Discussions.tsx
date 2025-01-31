"use client";

import React, { useState } from "react";

import DiscussionCreateButton from "@/components/discussion/create/DiscussionCreateButton";
import DiscussionsOrderBy from "@/components/discussion/DiscussionsOrderBy";
import DiscussionPreview from "@/components/discussion/preview/DiscussionPreview";
import { Card, CardContent } from "@/components/ui/card";
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

  const discussionsQuery = trpc.discussion.find.byQuery.useQuery({
    datasetId: datasetId,
    userId: userId,
    order:
      orderBy === "top"
        ? { upvoteCount: "desc", createdAt: "desc" }
        : { createdAt: "desc" },
    limit: 10,
    offset: 0,
  });

  if (!discussionsQuery.data || discussionsQuery.isLoading) {
    return (
      <div className="flex h-20 w-full items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="items-center max-sm:space-y-4 sm:flex">
        {discussionsQuery.data.discussions.length === 0 ? (
          <Card className="w-full">
            <CardContent className="flex h-[130px] items-center justify-center">
              <div className="space-y-3 text-center">
                <div className="text-muted-foreground">
                  There are no discussions yet
                </div>
                {allowCreate && (
                  <DiscussionCreateButton
                    text="Add Discussion"
                    authedRedirect="discussions/create"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          allowCreate && (
            <DiscussionCreateButton
              text="Add Discussion"
              authedRedirect="discussions/create"
              className="max-sm:w-full"
            />
          )
        )}

        {discussionsQuery.data.discussions.length > 0 && (
          <DiscussionsOrderBy
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            className="flex w-full justify-end"
          />
        )}
      </div>

      <div>
        {discussionsQuery.data.discussions.map((discussion, index) => (
          <React.Fragment key={discussion.id}>
            {index === 0 && <hr />}
            <DiscussionPreview
              discussion={discussion}
              showOnDataset={!!userId}
            />
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
