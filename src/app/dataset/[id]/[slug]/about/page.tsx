import { notFound } from "next/navigation";

import DatasetAbout from "@/components/dataset/tabs/about/DatasetAbout";
import service from "@/server/service";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const dataset = await service.dataset.find.privileged.byId(
    Number((await params).id),
  );

  if (!dataset) {
    return notFound();
  }

  return <DatasetAbout dataset={dataset} />;
}
