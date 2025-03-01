import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { DatasetQuickStats } from "@/components/dataset/tabs/about/DatasetQuickStats";
import { DatasetSideData } from "@/components/dataset/tabs/about/DatasetSideData";
import { DatasetSideStatus } from "@/components/dataset/tabs/about/DatasetSideStatus";
import { DatasetVariables } from "@/components/dataset/tabs/about/DatasetVariables";
import { DatasetMetadata } from "@/components/dataset/tabs/about/metadata/DatasetMetadata";
import { Expandable } from "@/components/ui/expandable";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const session = await auth();

  const { id } = await params;

  let dataset;
  try {
    dataset = await caller.dataset.find.byId({ datasetId: Number(id) });
  } catch {
    dataset = null;
  }

  if (!dataset) {
    return notFound();
  }

  return (
    <div className="flex justify-between gap-x-14 gap-y-10 max-lg:flex-col">
      <div className="w-full space-y-16">
        <div className="w-full space-y-10">
          <div>
            <h2 className="text-2xl font-bold">About Dataset</h2>
            {dataset.description ? (
              <Expandable className="whitespace-pre-wrap break-words">
                {dataset.description}
              </Expandable>
            ) : (
              <div className="text-muted-foreground">No information</div>
            )}
          </div>

          <DatasetQuickStats dataset={dataset} />
        </div>

        <DatasetVariables dataset={dataset} />

        <DatasetMetadata dataset={dataset} />
      </div>

      <div className="w-56 shrink-0 space-y-6">
        {isPriviliged(session?.user.role) && (
          <DatasetSideStatus status={dataset.status} />
        )}
        <DatasetSideData dataset={dataset} />
      </div>
    </div>
  );
}
