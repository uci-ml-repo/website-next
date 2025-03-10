import { notFound } from "next/navigation";

import { getDataset } from "@/app/dataset/[id]/[slug]/layout";
import { DatasetAbout } from "@/components/dataset/tabs/about/DatasetAbout";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;

  const dataset = await getDataset(Number(id));

  if (!dataset) {
    return notFound();
  }

  return <DatasetAbout />;
}
