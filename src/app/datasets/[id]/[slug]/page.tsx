import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { auth } from "@/auth";
import DatasetTitleGroup from "@/components/dataset/page/DatasetTitleGroup";
import { DatasetBookmarkProvider } from "@/components/dataset/page/interactions/bookmark/DatasetBookmarkedContext";
import DatasetInteractions from "@/components/dataset/page/interactions/DatasetInteractions";
import DatasetTabs from "@/components/dataset/page/tabs/DatasetTabs";
import Main from "@/components/layout/Main";
import { Card } from "@/components/ui/card";
import { caller } from "@/server/trpc/query/server";

const getDataset = cache(async (id: number) => {
  return caller.datasets.find.byId(id);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id, slug } = await params;

  const dataset = await getDataset(Number(id));

  if (!dataset || dataset.slug !== decodeURIComponent(slug)) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: dataset?.title,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;

  const dataset = await getDataset(Number(id));

  if (!dataset || dataset.slug !== decodeURIComponent(slug)) {
    return notFound();
  }

  const session = await auth();

  const initialBookmarked = session?.user.id
    ? await caller.bookmarks.find.isBookmarked({
        datasetId: dataset.id,
        userId: session?.user.id,
      })
    : false;

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

          <DatasetTabs dataset={dataset} />
        </DatasetBookmarkProvider>
      </div>
    </Main>
  );
}
