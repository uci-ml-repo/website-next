"use client";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetEditPendingActions } from "@/components/dataset/edit/DatasetEditPendingActions";
import { DatasetAbout } from "@/components/dataset/tabs/about/DatasetAbout";
import { DatasetIntroductoryPaper } from "@/components/dataset/tabs/about/DatasetIntroductoryPaper";
import { DatasetQuickStats } from "@/components/dataset/tabs/about/DatasetQuickStats";
import { DatasetSideData } from "@/components/dataset/tabs/about/DatasetSideData";
import { DatasetSideStatus } from "@/components/dataset/tabs/about/DatasetSideStatus";
import { DatasetVariables } from "@/components/dataset/tabs/about/DatasetVariables";
import { DatasetMetadata } from "@/components/dataset/tabs/about/metadata/DatasetMetadata";
import { isDraftOrPending } from "@/lib/utils/dataset";

export default function Page() {
  const { dataset, editable } = useDataset();

  return (
    <div className="flex justify-between gap-x-14 gap-y-10 max-lg:flex-col">
      <div className="w-full space-y-10">
        {isDraftOrPending(dataset) && <DatasetEditPendingActions />}
        <DatasetAbout />
        <DatasetQuickStats />
        <DatasetVariables />
        <DatasetIntroductoryPaper />
        <DatasetMetadata />
      </div>

      <div className="w-56 shrink-0 space-y-6">
        {editable && <DatasetSideStatus status={dataset.status} />}
        <DatasetSideData />
      </div>
    </div>
  );
}
