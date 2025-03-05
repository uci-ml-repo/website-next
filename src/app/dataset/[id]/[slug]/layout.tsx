import { forbidden, notFound, redirect, unauthorized } from "next/navigation";
import { cache } from "react";

import { auth } from "@/auth";
import { DatasetBookmarkProvider } from "@/components/dataset/context/DatasetBookmarkContext";
import { DatasetEditsProvider } from "@/components/dataset/context/DatasetEditsContext";
import { DatasetFilesStatusProvider } from "@/components/dataset/context/DatasetFilesStatusContext";
import { DatasetTitleGroup } from "@/components/dataset/DatasetTitleGroup";
import { DatasetInteractions } from "@/components/dataset/interactions/DatasetInteractions";
import { DatasetTabs } from "@/components/dataset/tabs/DatasetTabs";
import { Main } from "@/components/layout/Main";
import { Card } from "@/components/ui/card";
import { Enums } from "@/db/lib/enums";
import { DATASET_ROUTE } from "@/lib/routes";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";
import { caller } from "@/server/trpc/query/server";

const getDataset = cache(async (id: number) => {
  try {
    if (!Number(id)) {
      return null;
    }

    return await caller.dataset.find.byId({ datasetId: id });
  } catch {
    return null;
  }
});

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
    } else if (
      !isPriviliged(session?.user.role) &&
      dataset.userId !== session?.user.id
    ) {
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

  return (
    <DatasetBookmarkProvider initialBookmarked={initialBookmarked}>
      <DatasetFilesStatusProvider dataset={dataset}>
        <DatasetEditsProvider user={session?.user} dataset={dataset}>
          <Main className="space-y-6">
            <div className="backdrop-gradient-blur space-y-6">
              <div className="space-y-2">
                <DatasetTitleGroup dataset={dataset} />

                <Card className="rounded-full 2lg:hidden">
                  <DatasetInteractions
                    dataset={dataset}
                    className="w-full justify-around"
                  />
                </Card>
              </div>

              <DatasetTabs
                dataset={dataset}
                initialDiscussionCount={discussionCount}
              />
            </div>

            {children}
          </Main>
        </DatasetEditsProvider>
      </DatasetFilesStatusProvider>
    </DatasetBookmarkProvider>
  );
}
