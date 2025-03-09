"use client";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetEditPendingActions } from "@/components/dataset/edit/actions/DatasetEditPendingActions";
import { DatasetDescription } from "@/components/dataset/tabs/about/sections/DatasetDescription";
import { DatasetIntroductoryPaper } from "@/components/dataset/tabs/about/sections/DatasetIntroductoryPaper";
import { DatasetQuickStats } from "@/components/dataset/tabs/about/sections/DatasetQuickStats";
import { DatasetSideData } from "@/components/dataset/tabs/about/sections/DatasetSideData";
import { DatasetSideStatus } from "@/components/dataset/tabs/about/sections/DatasetSideStatus";
import { DatasetVariables } from "@/components/dataset/tabs/about/sections/DatasetVariables";
import { DatasetMetadata } from "@/components/dataset/tabs/about/sections/metadata/DatasetMetadata";
import { Enums } from "@/db/lib/enums";

export function DatasetAbout() {
  const { dataset, editable } = useDataset();

  return (
    <div className="flex justify-between gap-x-14 gap-y-10 max-lg:flex-col">
      <div className="w-full space-y-6">
        {dataset.status === Enums.ApprovalStatus.DRAFT && (
          <DatasetEditPendingActions />
        )}
        <div className="space-y-12">
          <DatasetDescription />
          <DatasetQuickStats />
          <DatasetVariables />
          <DatasetIntroductoryPaper />
          <DatasetMetadata />
        </div>
      </div>

      <div className="w-56 shrink-0 space-y-6">
        {editable && <DatasetSideStatus status={dataset.status} />}
        <DatasetSideData />
      </div>
    </div>
  );
}
