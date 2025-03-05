"use client";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { DatasetAbout } from "@/components/dataset/tabs/about/DatasetAbout";
import { DatasetQuickStats } from "@/components/dataset/tabs/about/DatasetQuickStats";
import { DatasetSideData } from "@/components/dataset/tabs/about/DatasetSideData";
import { DatasetSideStatus } from "@/components/dataset/tabs/about/DatasetSideStatus";
import { DatasetVariables } from "@/components/dataset/tabs/about/DatasetVariables";
import { DatasetMetadata } from "@/components/dataset/tabs/about/metadata/DatasetMetadata";

export default function Page() {
  const { dataset, editable } = useDataset();

  return (
    <div className="flex justify-between gap-x-14 gap-y-10 max-lg:flex-col">
      <div className="w-full space-y-10">
        <DatasetAbout dataset={dataset} />

        <DatasetQuickStats dataset={dataset} />

        <DatasetVariables dataset={dataset} />

        <DatasetMetadata dataset={dataset} />
      </div>

      <div className="w-56 shrink-0 space-y-6">
        {editable && <DatasetSideStatus status={dataset.status} />}

        <DatasetSideData dataset={dataset} />
      </div>
    </div>
  );
}
