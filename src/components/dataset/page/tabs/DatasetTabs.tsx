import DatasetInteractions from "@/components/dataset/page/interactions/DatasetInteractions";
import About from "@/components/dataset/page/tabs/about/About";
import Discussions from "@/components/dataset/page/tabs/discussions/Discussions";
import Files from "@/components/dataset/page/tabs/files/Files";
import {
  LinearTabs,
  LinearTabsContent,
  LinearTabsList,
  LinearTabsTrigger,
  TabsListBorder,
} from "@/components/ui/linear-tabs";
import type { DatasetResponse } from "@/lib/types";
import { datasetFilesPath } from "@/lib/utils";
import { caller } from "@/server/trpc/query/server";

export default async function DatasetTabs({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const discussions = await caller.discussions.find.byQuery({
    datasetId: dataset.id,
  });

  let zipStats;
  try {
    zipStats = await caller.files.read.zipStats({
      path: datasetFilesPath(dataset) + ".zip",
    });
  } catch {
    zipStats = null;
  }

  return (
    <LinearTabs defaultValue="about">
      <div className="flex items-center justify-between space-x-6 overflow-x-auto px-1">
        <LinearTabsList className="space-x-8">
          <LinearTabsTrigger value="about">About</LinearTabsTrigger>
          {zipStats && (
            <LinearTabsTrigger value="files">Files</LinearTabsTrigger>
          )}
          <LinearTabsTrigger
            value="discussions"
            badgeValue={discussions.length}
          >
            Discussions
          </LinearTabsTrigger>
        </LinearTabsList>
        <DatasetInteractions dataset={dataset} className="max-md:hidden" />
      </div>
      <TabsListBorder />

      <div className="hide-inactive">
        <LinearTabsContent value="about">
          <About dataset={dataset} />
        </LinearTabsContent>
        {zipStats && (
          <LinearTabsContent value="files" forceMount>
            <Files dataset={dataset} />
          </LinearTabsContent>
        )}
        <LinearTabsContent value="discussions" forceMount>
          <Discussions dataset={dataset} />
        </LinearTabsContent>
      </div>
    </LinearTabs>
  );
}
