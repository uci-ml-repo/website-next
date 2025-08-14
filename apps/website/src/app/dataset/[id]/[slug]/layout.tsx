import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import { forbidden, notFound, permanentRedirect, unauthorized } from "next/navigation";
import type { ReactNode } from "react";
import { cache } from "react";

import { ROUTES } from "@/lib/routes";
import { HydrateClient, trpc } from "@/server/trpc/query/server";
import { DatasetViewHeader } from "@/components/dataset/view/dataset-view-header";

const getDataset = cache(async (id: number) => {
  return trpc.dataset.find.byId({ id });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  try {
    const dataset = await getDataset(Number(id));
    return { title: dataset.title };
  } catch {
    return { title: "Not Found" };
  }
}

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id: idString, slug } = await params;
  const id = Number(idString);

  if (isNaN(id)) return notFound();

  let dataset;
  try {
    dataset = await getDataset(Number(id));
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

  if (dataset.slug !== decodeURIComponent(slug)) permanentRedirect(ROUTES.DATASET(dataset));

  return (
    <HydrateClient>
      <DatasetViewHeader id={id} />
      {children}
    </HydrateClient>
  );
}
