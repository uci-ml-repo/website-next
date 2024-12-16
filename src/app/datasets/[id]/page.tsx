import { notFound, redirect } from "next/navigation";

import { DATASETS_PATH } from "@/lib/routes";
import service from "@/server/service";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dataset = await service.datasets.find.byId(Number(id));

  if (!dataset) {
    notFound();
  }

  redirect(
    `${DATASETS_PATH}/${dataset.id}/${encodeURIComponent(dataset.slug)}`,
  );
}
