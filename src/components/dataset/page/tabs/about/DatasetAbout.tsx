import { DatasetMetadata } from "@/components/dataset/page/tabs/about/DatasetMetadata";
import DatasetQuickStats from "@/components/dataset/page/tabs/about/DatasetQuickStats";
import DatasetSideData from "@/components/dataset/page/tabs/about/DatasetSideData";
import DatasetVariables from "@/components/dataset/page/tabs/about/DatasetVariables";
import type { DatasetResponse } from "@/lib/types";

export default function DatasetAbout({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  return (
    <div className="space-y-16">
      <div className="flex justify-between gap-x-14 gap-y-10 max-lg:flex-col">
        <div className="w-full space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">About Dataset</h2>
            <div className="break-words">{dataset.description}</div>
          </div>
          <DatasetQuickStats dataset={dataset} />
          <hr className="lg:hidden" />
        </div>

        <DatasetSideData dataset={dataset} />
      </div>

      <DatasetVariables dataset={dataset} />

      <DatasetMetadata dataset={dataset} />
    </div>
  );
}
