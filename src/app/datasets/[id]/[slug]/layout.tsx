import type { Metadata } from "next";
import { notFound } from "next/navigation";
import path from "path";
import { cache } from "react";

import { auth } from "@/auth";
import DatasetTitleGroup from "@/components/dataset/page/DatasetTitleGroup";
import { DatasetBookmarkProvider } from "@/components/dataset/page/interactions/bookmark/DatasetBookmarkedContext";
import DatasetInteractions from "@/components/dataset/page/interactions/DatasetInteractions";
import Main from "@/components/layout/Main";
import { Card } from "@/components/ui/card";
import {
  LinearTabs,
  LinearTabsList,
  LinearTabsTrigger,
  TabsListBorder,
} from "@/components/ui/linear-tabs";
import { DATASETS_PATH } from "@/lib/routes";
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
    ? await caller.bookmarks.find.isBookmarked({
        datasetId: dataset.id,
        userId: session?.user.id,
      })
    : false;

  const discussionsQuery = await caller.discussions.find.byQuery({
    datasetId: dataset.id,
  });

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

          <LinearTabs defaultValue="files">
            <div className="flex items-center justify-between space-x-6 overflow-x-auto px-1">
              <LinearTabsList className="space-x-8">
                <LinearTabsTrigger
                  value="about"
                  link={path.join(basePath, "about")}
                >
                  About
                </LinearTabsTrigger>
                {!dataset.externalLink && (
                  <LinearTabsTrigger
                    value="files"
                    link={path.join(basePath, "files")}
                  >
                    Files
                  </LinearTabsTrigger>
                )}
                <LinearTabsTrigger
                  value="discussions"
                  badgeValue={discussionsQuery.discussions.length}
                  link={path.join(basePath, "discussions")}
                >
                  Discussions
                </LinearTabsTrigger>
              </LinearTabsList>
              <DatasetInteractions
                dataset={dataset}
                className="max-md:hidden"
              />
            </div>
            <TabsListBorder />

            {children}

            {/*    <div>*/}
            {/*      <LinearTabsContent value="about">*/}
            {/*        <About dataset={dataset} />*/}
            {/*      </LinearTabsContent>*/}
            {/*      {!dataset.externalLink && (*/}
            {/*        <LinearTabsContent value="files">*/}
            {/*          <FileProvider*/}
            {/*            initialPath={{*/}
            {/*              path: datasetFilesPath(dataset),*/}
            {/*              type: "directory",*/}
            {/*            }}*/}
            {/*          >*/}
            {/*            <Files dataset={dataset} />*/}
            {/*          </FileProvider>*/}
            {/*        </LinearTabsContent>*/}
            {/*      )}*/}
            {/*      <LinearTabsContent value="discussions">*/}
            {/*        <Discussions dataset={dataset} />*/}
            {/*      </LinearTabsContent>*/}
            {/*    </div>*/}
          </LinearTabs>
        </DatasetBookmarkProvider>
      </div>
    </Main>
  );
}
