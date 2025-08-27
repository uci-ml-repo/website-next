"use client";

import { DatasetAboutFeatures } from "@/components/dataset/view/about/features/dataset-about-features";
import { DatasetAboutStats } from "@/components/dataset/view/about/stats/dataset-about-stats";
import type { DatasetFull } from "@/server/types/dataset/response";

import { DatasetAboutSideData } from "./side/dataset-about-side-data";

export function DatasetAbout({ dataset }: { dataset: DatasetFull }) {
  return (
    <div className="flex gap-x-12 gap-y-10 max-lg:flex-col">
      <div className="space-y-12">
        <div className="space-y-2">
          <div className="text-xl font-bold">About</div>
          <div className="whitespace-pre-wrap">{dataset.description}</div>
        </div>
        <DatasetAboutStats dataset={dataset} />

        <DatasetAboutFeatures dataset={dataset} />
      </div>

      <div className="shrink-0 lg:w-56">
        <DatasetAboutSideData dataset={dataset} />
      </div>
    </div>
  );
}
