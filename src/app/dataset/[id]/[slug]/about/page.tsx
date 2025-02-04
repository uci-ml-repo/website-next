import { notFound } from "next/navigation";

import DatasetAbout from "@/components/dataset/tabs/about/DatasetAbout";
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

  return <DatasetAbout dataset={dataset} />;
}
