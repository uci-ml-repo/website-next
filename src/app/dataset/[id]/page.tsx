import { TRPCError } from "@trpc/server";
import { forbidden, notFound, redirect, unauthorized } from "next/navigation";

import { DATASET_ROUTE } from "@/lib/routes";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const dataset = await caller.dataset.find.byId({ datasetId: Number(id) });
    redirect(DATASET_ROUTE({ id: dataset.id, slug: dataset.slug }));
  } catch (error) {
    if (error instanceof TRPCError) {
      switch (error.code) {
        case "NOT_FOUND":
          return notFound();
        case "UNAUTHORIZED":
          return unauthorized();
        case "FORBIDDEN":
          return forbidden();
      }
    }

    throw error;
  }
}
