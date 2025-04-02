import { notFound } from "next/navigation";

import { getDataset } from "@/app/dataset/[id]/[slug]/get-dataset";
import { DatasetFiles } from "@/components/dataset/tabs/files/DatasetFiles";

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id } = await params;

  const dataset = await getDataset(Number(id));

  if (!dataset) {
    return notFound();
  }

  return <DatasetFiles />;
}
