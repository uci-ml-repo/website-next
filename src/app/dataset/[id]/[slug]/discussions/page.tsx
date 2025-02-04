import React from "react";

import DiscussionCreateButton from "@/components/discussion/create/DiscussionCreateButton";
import Discussions from "@/components/discussion/Discussions";
import { Card, CardContent } from "@/components/ui/card";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const dataset = await caller.dataset.find.byId(Number((await params).id));
  const hasDiscussions =
    (
      await caller.discussion.find.byQuery({
        datasetId: dataset!.id,
        limit: 1,
      })
    ).discussions.length > 0;

  return hasDiscussions ? (
    <Discussions datasetId={dataset!.id} allowCreate />
  ) : (
    <Card className="w-full">
      <CardContent className="flex h-[130px] items-center justify-center bg-muted">
        <div className="space-y-3 text-center">
          <div className="text-muted-foreground">
            There are no discussions yet
          </div>
          <DiscussionCreateButton />
        </div>
      </CardContent>
    </Card>
  );
}
