import { forbidden, notFound, redirect, unauthorized } from "next/navigation";
import React from "react";

import { getDataset } from "@/app/dataset/[id]/[slug]/get-dataset";
import { auth } from "@/auth";
import { DatasetBookmarkProvider } from "@/components/dataset/context/DatasetBookmarkContext";
import { DatasetProvider } from "@/components/dataset/context/DatasetContext";
import { DatasetFileStatusProvider } from "@/components/dataset/context/DatasetFilesStatusContext";
import { DatasetTitleGroup } from "@/components/dataset/DatasetTitleGroup";
import { DatasetEditing } from "@/components/dataset/edit/DatasetEditing";
import { DatasetInteractions } from "@/components/dataset/interactions/DatasetInteractions";
import { DatasetTabs } from "@/components/dataset/tabs/DatasetTabs";
import { Main } from "@/components/layout/Main";
import { Card } from "@/components/ui/card";
import { Enums } from "@/db/lib/enums";
import { DATASET_ROUTE } from "@/lib/routes";
import { service } from "@/server/service";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";
import { caller } from "@/server/trpc/query/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;

  const dataset = await getDataset(Number(id));

  if (!dataset) {
    return { title: "Not Found" };
  }

  return { title: dataset.title };
}

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string; slug: string }>;
}) {
  const session = await auth();
  const { id, slug } = await params;

  const dataset = await getDataset(Number(id));

  if (!dataset) {
    return notFound();
  }

  if (dataset.slug !== decodeURIComponent(slug)) {
    return redirect(DATASET_ROUTE(dataset));
  }

  if (dataset.status !== Enums.ApprovalStatus.APPROVED) {
    if (!session?.user) {
      return unauthorized();
    } else if (!isPriviliged(session?.user.role) && dataset.userId !== session?.user.id) {
      return forbidden();
    }
  }

  const initialBookmarked = session?.user.id
    ? await caller.bookmark.find.isBookmarked({
        datasetId: dataset.id,
        userId: session.user.id,
      })
    : false;

  const discussionCount = await caller.discussion.find.countByQuery({
    datasetId: dataset.id,
  });

  let editCount;
  try {
    editCount = await caller.edit.find.countByQuery({
      datasetId: dataset.id,
    });
  } catch {
    editCount = 0;
  }

  const datasetFileStatuses = await service.dataset.file.fileStatuses(dataset);

  return (
    <DatasetBookmarkProvider initialBookmarked={initialBookmarked}>
      <DatasetProvider user={session?.user} initialDataset={dataset}>
        <DatasetFileStatusProvider
          dataset={dataset}
          initialStatus={datasetFileStatuses.status}
          initialPendingStatus={datasetFileStatuses.pendingStatus}
          initialHasPendingThumbnail={datasetFileStatuses.hasPendingThumbnail}
        >
          <Main>
            <div className="backdrop-gradient-blur space-y-6">
              <div className="space-y-4">
                <DatasetTitleGroup />

                <Card className="rounded-full 2lg:hidden">
                  <DatasetInteractions dataset={dataset} className="w-full justify-around" />
                </Card>
              </div>

              <DatasetTabs initialDiscussionCount={discussionCount} initialEditCount={editCount} />

              <DatasetEditing />

              {children}
            </div>
          </Main>
        </DatasetFileStatusProvider>
      </DatasetProvider>
    </DatasetBookmarkProvider>
  );
}
