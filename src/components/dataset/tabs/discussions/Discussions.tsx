"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

import DiscussionCreateButton from "@/components/dataset/tabs/discussions/create/DiscussionCreateButton";
import DiscussionsOrderBy from "@/components/dataset/tabs/discussions/DiscussionsOrderBy";
import { Card, CardContent } from "@/components/ui/card";
import Spinner from "@/components/ui/spinner";
import type { DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

import Discussion from "./view/Discussion";

export type DiscussionsOrderBy = "top" | "new";

export default function Discussions({ dataset }: { dataset: DatasetResponse }) {
  const { data: session, status } = useSession();

  const [orderBy, setOrderBy] = useState<"top" | "new">("top");

  const discussionsQuery = trpc.discussions.find.byQuery.useQuery(
    {
      datasetId: dataset.id,
      order: [
        orderBy === "top"
          ? {
              orderBy: "upvoteCount",
              sort: "desc",
            }
          : {
              orderBy: "createdAt",
              sort: "desc",
            },
      ],
    },
    {
      enabled: status !== "loading",
    },
  );

  if (!discussionsQuery.data || discussionsQuery.isLoading) {
    return (
      <div className="flex h-20 w-full items-center justify-center">
        <Spinner className="size-10" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="items-center space-y-6 sm:flex">
          {discussionsQuery.data.discussions.length === 0 ? (
            <Card className="w-full">
              <CardContent className="flex h-[130px] items-center justify-center">
                <div className="space-y-4 text-center">
                  <div className="text-muted-foreground">
                    There are no discussions yet
                  </div>
                  <DiscussionCreateButton
                    text="Start a discussion"
                    session={session}
                    authedRedirect="discussions/create"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <DiscussionCreateButton
              text="Add discussion"
              session={session}
              authedRedirect="discussions/create"
            />
          )}

          {discussionsQuery.data.discussions.length > 0 && (
            <DiscussionsOrderBy
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              className="sm:flex sm:w-full sm:justify-end"
            />
          )}
        </div>
      </div>

      <div className="space-y-3">
        {discussionsQuery.data.discussions.map((discussion) => (
          <Discussion key={discussion.id} discussion={discussion} />
        ))}
      </div>
    </div>
  );
}
