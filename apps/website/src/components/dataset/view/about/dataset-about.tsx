"use client";

import { DatasetAboutFeatures } from "@/components/dataset/view/about/features/dataset-about-features";
import { trpc } from "@/server/trpc/query/client";

import { DatasetAboutSideData } from "./side/dataset-about-side-data";

export function DatasetAbout({ datasetId }: { datasetId: number }) {
  const { data: dataset } = trpc.dataset.find.byId.useQuery({ datasetId });

  if (!dataset) throw new Error("Dataset should be prefetched");

  return (
    <div className="flex gap-x-12 gap-y-10 max-lg:flex-col">
      <div className="space-y-10">
        <div className="space-y-2">
          <div className="text-xl font-bold">About</div>
          <div className="whitespace-pre-wrap">{dataset.description}</div>
        </div>

        <DatasetAboutFeatures dataset={dataset} />
      </div>

      <div className="shrink-0 lg:w-56">
        <DatasetAboutSideData dataset={dataset} />
      </div>
    </div>
  );
}
