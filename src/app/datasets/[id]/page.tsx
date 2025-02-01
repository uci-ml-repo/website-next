import { notFound, redirect } from "next/navigation";

import { DATASETS_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dataset = await caller.dataset.find.byId(Number(id));

  if (!dataset) {
    notFound();
  }

  redirect(
    `${DATASETS_ROUTE}/${dataset.id}/${encodeURIComponent(dataset.slug)}`,
  );
}
