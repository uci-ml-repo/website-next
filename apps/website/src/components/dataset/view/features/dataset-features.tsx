"use client";

import { trpc } from "@/server/trpc/query/client";

export function DatasetFeatures({ datasetId }: { datasetId: number }) {
  const { data: dataset } = trpc.dataset.find.byId.useQuery({ datasetId });

  if (!dataset) throw new Error("Dataset should be prefetched");

  return <div>{JSON.stringify(dataset.features)}</div>;
}
