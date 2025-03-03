import { notFound } from "next/navigation";

import { DatasetFiles } from "@/components/dataset/tabs/files/DatasetFiles";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
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

  return <DatasetFiles dataset={dataset} />;
}
