"use client";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetEditPendingActions } from "@/components/dataset/edit/actions/DatasetEditPendingActions";
import { DatasetDescription } from "@/components/dataset/tabs/about/sections/description/DatasetDescription";
import { DatasetMetadata } from "@/components/dataset/tabs/about/sections/metadata/DatasetMetadata";
import { DatasetIntroductoryPaper } from "@/components/dataset/tabs/about/sections/paper/DatasetIntroductoryPaper";
import { DatasetSideData } from "@/components/dataset/tabs/about/sections/side/DatasetSideData";
import { DatasetStats } from "@/components/dataset/tabs/about/sections/stats/DatasetStats";
import { DatasetVariables } from "@/components/dataset/tabs/about/sections/variables/DatasetVariables";
import { Enums } from "@/db/lib/enums";

export function DatasetAbout() {
  const { dataset } = useDataset();

  return (
    <div className="flex justify-between gap-x-14 gap-y-10 max-lg:flex-col">
      <div className="w-full space-y-6">
        {dataset.status === Enums.ApprovalStatus.DRAFT && <DatasetEditPendingActions />}
        <div className="space-y-12">
          <div className="space-y-8">
            <DatasetDescription />
            <DatasetStats />
          </div>
          <DatasetVariables />
          <DatasetIntroductoryPaper />
          <DatasetMetadata />
        </div>
      </div>

      <div className="w-56 shrink-0">
        <DatasetSideData />
      </div>
    </div>
  );
}
