import type { Metadata } from "next";
import { forbidden, notFound } from "next/navigation";
import path from "path";
import { cache } from "react";

import { auth } from "@/auth";
import DatasetTitleGroup from "@/components/dataset/DatasetTitleGroup";
import { DatasetBookmarkProvider } from "@/components/dataset/interactions/bookmark/DatasetBookmarkedContext";
import DatasetInteractions from "@/components/dataset/interactions/DatasetInteractions";
import DatasetTabs from "@/components/dataset/tabs/DatasetTabs";
import Main from "@/components/layout/Main";
import { Card } from "@/components/ui/card";
import { Enums } from "@/db/enums";
import { DATASETS_ROUTE } from "@/lib/routes";
import service from "@/server/service";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";
import { caller } from "@/server/trpc/query/server";

const getDataset = cache(async (id: number) => {
  return service.dataset.find.privileged.byId(id);
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
  if (!dataset || dataset.slug !== decodeURIComponent(slug)) {
    return notFound();
  }

  if (
    dataset.status !== Enums.DatasetStatus.APPROVED &&
    !isPriviliged(session?.user.role) &&
    dataset.userId !== session?.user.id
  ) {
    return forbidden();
  }

  const initialBookmarked = session?.user.id
    ? await caller.bookmark.find.isBookmarked({
        datasetId: dataset.id,
        userId: session.user.id,
      })
    : false;

  const basePath = path.join(DATASETS_ROUTE, id, slug);

  return (
    <DatasetBookmarkProvider initialBookmarked={initialBookmarked}>
      <Main className="space-y-8">
        <DatasetTitleGroup dataset={dataset} />

        <Card className="rounded-full md:hidden">
          <DatasetInteractions
            dataset={dataset}
            className="w-full justify-around"
          />
        </Card>

        <DatasetTabs basePath={basePath} dataset={dataset} />

        {children}
      </Main>
    </DatasetBookmarkProvider>
  );
}
