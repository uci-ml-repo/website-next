import { notFound } from "next/navigation";

import { DatasetQuickStats } from "@/components/dataset/tabs/about/DatasetQuickStats";
import { DatasetSideData } from "@/components/dataset/tabs/about/DatasetSideData";
import { DatasetVariables } from "@/components/dataset/tabs/about/DatasetVariables";
import { DatasetMetadata } from "@/components/dataset/tabs/about/metadata/DatasetMetadata";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;

  const dataset = await caller.dataset.find.byId({ datasetId: Number(id) });

  if (!dataset) {
    return notFound();
  }

  return (
    <div className="space-y-16">
      <div className="flex justify-between gap-x-14 gap-y-10 max-lg:flex-col">
        <div className="w-full space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">About Dataset</h2>
            <div className="break-words whitespace-pre-wrap">
              {dataset.description}
            </div>
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
