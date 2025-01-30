import type { Metadata } from "next";
import { notFound } from "next/navigation";
import path from "path";
import { cache } from "react";

import { auth } from "@/auth";
import DatasetTitleGroup from "@/components/dataset/DatasetTitleGroup";
import { DatasetBookmarkProvider } from "@/components/dataset/interactions/bookmark/DatasetBookmarkedContext";
import DatasetInteractions from "@/components/dataset/interactions/DatasetInteractions";
import DatasetTabs from "@/components/dataset/tabs/DatasetTabs";
import Main from "@/components/layout/Main";
import { Card } from "@/components/ui/card";
import { DATASETS_PATH } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

const getDataset = cache(async (id: number) => {
  return caller.dataset.find.byId(id);
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

  const initialBookmarked = session?.user.id
    ? await caller.bookmark.find.isBookmarked({
        datasetId: dataset.id,
        userId: session.user.id,
      })
    : false;

  const basePath = path.join(DATASETS_PATH, id, slug);

  return (
    <Main className="content space-y-6">
      <div className="space-y-8">
        <DatasetTitleGroup dataset={dataset} />

        <DatasetBookmarkProvider initialBookmarked={initialBookmarked}>
          <Card className="rounded-full md:hidden">
            <DatasetInteractions
              dataset={dataset}
              className="w-full justify-around"
            />
          </Card>

          <DatasetTabs basePath={basePath} dataset={dataset}>
            {children}
          </DatasetTabs>
        </DatasetBookmarkProvider>
      </div>
    </Main>
  );
}
