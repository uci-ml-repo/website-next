import { notFound } from "next/navigation";
import React from "react";

import { getDataset } from "@/app/dataset/[id]/[slug]/get-dataset";
import { Discussions } from "@/components/discussion/Discussions";
import { caller } from "@/server/trpc/query/server";

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id } = await params;

  const dataset = await getDataset(Number(id));

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

  return <Discussions datasetId={dataset.id} initialHasDiscussions={hasDiscussions} allowCreate />;
}
