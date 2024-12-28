import DatasetInteractions from "@/components/dataset/page/interactions/DatasetInteractions";
import DatasetAbout from "@/components/dataset/page/tabs/about/DatasetAbout";
import DatasetDiscussion from "@/components/dataset/page/tabs/discussion/DatasetDiscussion";
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
}: {
  dataset: DatasetResponse;
}) {
  const discussions = await caller.discussions.find.byQuery({
    datasetId: dataset.id,
  });

  return (
    <LinearTabs defaultValue="about">
      <div className="flex items-center justify-between space-x-8">
        <LinearTabsList className="space-x-10 overflow-x-auto">
          <LinearTabsTrigger value="about">About</LinearTabsTrigger>
          <LinearTabsTrigger value="files">Files</LinearTabsTrigger>
          <LinearTabsTrigger
            value="discussion"
            badge
            badgeValue={discussions.length}
          >
            Discussion
          </LinearTabsTrigger>
        </LinearTabsList>
        <DatasetInteractions dataset={dataset} className="max-md:hidden" />
      </div>
      <TabsListBorder />

      <div className="hide-inactive">
        <LinearTabsContent value="about">
          <DatasetAbout dataset={dataset} />
        </LinearTabsContent>
        <LinearTabsContent value="files" forceMount>
          <DatasetFiles dataset={dataset} />
        </LinearTabsContent>
        <LinearTabsContent value="discussion" forceMount>
          <DatasetDiscussion dataset={dataset} />
        </LinearTabsContent>
      </div>
    </LinearTabs>
  );
}
