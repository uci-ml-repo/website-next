import DatasetAbout from "@/components/dataset/page/tabs/about/DatasetAbout";
import DatasetDiscussions from "@/components/dataset/page/tabs/discussions/Discussions";
import DatasetFiles from "@/components/dataset/page/tabs/files/DatasetFiles";
import {
  LinearTabs,
  LinearTabsContent,
  LinearTabsList,
  LinearTabsTrigger,
  TabsListBorder,
} from "@/components/ui/linear-tabs";
import type { DatasetResponse } from "@/lib/types";
import { caller } from "@/server/trpc/query/server";

export default async function DatasetTabs({
  dataset,
  children,
}: {
  dataset: DatasetResponse;
  children?: React.ReactNode;
}) {
  const discussions = await caller.discussions.find.byQuery({
    datasetId: dataset.id,
  });

  return (
    <LinearTabs defaultValue="about" urlStore={true}>
      <div className="flex items-center justify-between space-x-6 overflow-x-auto">
        <LinearTabsList className="space-x-8">
          <LinearTabsTrigger value="about">About</LinearTabsTrigger>
          {dataset.fileCount && (
            <LinearTabsTrigger value="files">Files</LinearTabsTrigger>
          )}
          <LinearTabsTrigger
            value="discussions"
            badgeValue={discussions.length}
          >
            Discussions
          </LinearTabsTrigger>
        </LinearTabsList>
        {children}
      </div>
      <TabsListBorder />

      <div className="hide-inactive">
        <LinearTabsContent value="about">
          <DatasetAbout dataset={dataset} />
        </LinearTabsContent>
        {dataset.fileCount && (
          <LinearTabsContent value="files" forceMount>
            <DatasetFiles dataset={dataset} />
          </LinearTabsContent>
        )}
        <LinearTabsContent value="discussions" forceMount>
          <DatasetDiscussions dataset={dataset} />
        </LinearTabsContent>
      </div>
    </LinearTabs>
  );
}
