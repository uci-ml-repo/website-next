import { notFound } from "next/navigation";
import React from "react";

import { DiscussionCreateButton } from "@/components/discussion/create/DiscussionCreateButton";
import { Discussions } from "@/components/discussion/Discussions";
import { AlternativeCard } from "@/components/ui/card";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;

  let dataset;
  try {
    dataset = await caller.dataset.find.byId({ datasetId: Number(id) });
  } catch {
    dataset = null;
  }

  if (!dataset) {
    return notFound();
  }

  const hasDiscussions =
    (
      await caller.discussion.find.byQuery({
        datasetId: dataset.id,
        limit: 1,
      })
    ).discussions.length > 0;

  return hasDiscussions ? (
    <Discussions datasetId={dataset.id} allowCreate />
  ) : (
    <AlternativeCard>
      <div className="space-y-3 text-center">
        <div className="text-muted-foreground">
          There are no discussions yet. Be the first to discuss this dataset!
        </div>
        <DiscussionCreateButton dataset={dataset} />
      </div>
    </AlternativeCard>
  );
}
