import { auth } from "@packages/auth/auth";
import { TRPCError } from "@trpc/server";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { forbidden, notFound, permanentRedirect, unauthorized } from "next/navigation";
import type { ReactNode } from "react";
import { cache } from "react";

import { DatasetHeader } from "@/components/dataset/view/header/dataset-header";
import { DatasetInteractions } from "@/components/dataset/view/header/dataset-interactions";
import { DatasetNav } from "@/components/dataset/view/header/dataset-nav";
import { ROUTES } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/server";

const getDataset = cache(async (id: number) => {
  return trpc.dataset.find.byId({ datasetId: id });
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id: _id, slug } = await params;
  const id = Number(_id);

  try {
    const dataset = await getDataset(id);
    return {
      title: dataset.title,
      alternates: { canonical: ROUTES.DATASET({ id, slug }) },
      description: dataset.description,
    };
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

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    await trpc.bookmark.find.isDatasetBookmarked.prefetch({
      userId: session.user.id,
      datasetId: id,
    });
  }

  return (
    <div className="blur-background space-y-6">
      <div className="space-y-6">
        <DatasetHeader dataset={dataset} session={session} />
        <div className="flex items-end justify-between">
          <DatasetNav dataset={dataset} session={session} />
          <DatasetInteractions
            dataset={dataset}
            session={session}
            className="flex-shrink-0 border-b pt-2 pb-1 pl-4 max-sm:hidden"
          />
        </div>
      </div>
      {children}
    </div>
  );
}
