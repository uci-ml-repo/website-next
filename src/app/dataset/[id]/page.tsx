import { notFound, redirect } from "next/navigation";

import { DATASET_ROUTE } from "@/lib/routes";
import service from "@/server/service";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dataset = await service.dataset.find.privileged.byId(Number(id));

  if (!dataset) {
    notFound();
  }

  redirect(DATASET_ROUTE({ id: dataset.id, slug: dataset.slug }));
}
