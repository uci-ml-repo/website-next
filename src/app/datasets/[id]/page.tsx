import { notFound, redirect } from "next/navigation";

import { DATASETS_PATH } from "@/lib/routes";
import { caller } from "@/server/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const dataset = await caller.datasets.findById(Number(id));

  if (!dataset) {
    notFound();
  }

  redirect(
    `${DATASETS_PATH}/${dataset.id}/${encodeURIComponent(dataset.slug)}`,
  );
}
