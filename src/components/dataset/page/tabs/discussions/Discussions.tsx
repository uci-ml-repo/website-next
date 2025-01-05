"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

import DiscussionCreateButton from "@/components/dataset/page/tabs/discussions/create/DiscussionCreateButton";
import DiscussionCreateInput from "@/components/dataset/page/tabs/discussions/create/DiscussionCreateInput";
import DiscussionsOrderBy from "@/components/dataset/page/tabs/discussions/DiscussionsOrderBy";
import Discussion from "@/components/dataset/page/tabs/discussions/view/Discussion";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import type { DatasetResponse } from "@/lib/types";
import type { DiscussionQuery } from "@/server/schema/discussions";
import { trpc } from "@/server/trpc/query/client";

export default function Discussions({ dataset }: { dataset: DatasetResponse }) {
  const { data: session } = useSession();

  const [isAuthoring, setIsAuthoring] = useState<boolean>(false);
  const [orderBy, setOrderBy] =
    useState<DiscussionQuery["orderBy"]>("upvoteCount");

  const discussionsQuery = trpc.discussions.find.byQuery.useQuery({
    datasetId: dataset.id,
    orderBy: orderBy,
    excludeReplies: true,
  });

  if (discussionsQuery.isLoading) {
    return (
      <div className="flex h-20 w-full items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  const discussions = discussionsQuery.data!;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Discussions</h2>

      <div>
        {isAuthoring && (
          <DiscussionCreateInput
            datasetId={dataset.id}
            setIsAuthoring={setIsAuthoring}
            className="mb-6"
          />
        )}
        <div className="items-center space-y-6 sm:flex">
          {!isAuthoring &&
            (discussions.length === 0 ? (
              <Card className="w-full">
                <CardContent className="flex h-[130px] items-center justify-center">
                  <div className="space-y-4 text-center">
                    <div className="text-muted-foreground">
                      There are no discussions yet
                    </div>
                    <DiscussionCreateButton
                      text="Start a discussion"
                      session={session}
                      authAction={() => setIsAuthoring(true)}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <DiscussionCreateButton
                text="Add discussion"
                session={session}
                authAction={() => setIsAuthoring(true)}
              />
            ))}

          {discussions.length > 0 && (
            <DiscussionsOrderBy
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              className="sm:flex sm:w-full sm:justify-end"
            />
          )}
        </div>
      </div>

      <div className="space-y-6">
        {discussions.map((discussion) => (
          <Discussion key={discussion.id} discussion={discussion} />
        ))}
      </div>
    </div>
  );
}
