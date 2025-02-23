import type { Metadata } from "next";
import { forbidden, notFound, redirect, unauthorized } from "next/navigation";
import { cache } from "react";

import { auth } from "@/auth";
import { DatasetTitleGroup } from "@/components/dataset/DatasetTitleGroup";
import { DatasetBookmarkProvider } from "@/components/dataset/interactions/bookmark/DatasetBookmarkedContext";
import { DatasetInteractions } from "@/components/dataset/interactions/DatasetInteractions";
import { DatasetTabs } from "@/components/dataset/tabs/DatasetTabs";
import { Main } from "@/components/layout/Main";
import { Card } from "@/components/ui/card";
import { Enums } from "@/db/lib/enums";
import { DATASET_ROUTE } from "@/lib/routes";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";
import { caller } from "@/server/trpc/query/server";

const getDataset = cache(async (id: number) => {
  return caller.dataset.find.byId({ datasetId: id });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id, slug } = await params;
  const dataset = await getDataset(Number(id));

  if (!dataset || dataset.slug !== decodeURIComponent(slug)) {
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

  return (
    <DatasetBookmarkProvider initialBookmarked={initialBookmarked}>
      <Main className="space-y-6">
        <div className="backdrop-gradient-blur space-y-6">
          <DatasetTitleGroup dataset={dataset} />

          <Card className="rounded-full md:hidden">
            <DatasetInteractions
              dataset={dataset}
              className="w-full justify-around"
            />
          </Card>

          <DatasetTabs dataset={dataset} />
        </div>

        {children}
      </Main>
    </DatasetBookmarkProvider>
  );
}
