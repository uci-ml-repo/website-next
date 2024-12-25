import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import DatasetTitleGroup from "@/components/dataset/page/DatasetTitleGroup";
import DatasetTabs from "@/components/dataset/page/tabs/DatasetTabs";
import Main from "@/components/layout/Main";
import { caller } from "@/server/trpc/server";

const getDataset = cache(async (id: number) => {
  return caller.dataset.find.byId(id);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}): Promise<Metadata> {
  const { id, slug } = await params;

  const dataset = await getDataset(Number(id));

  if (!dataset || dataset.slug !== decodeURIComponent(slug)) {
    return {
      title: "Not Found",
    };
  }

  return {
    title: dataset?.title,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;

  const dataset = await getDataset(Number(id));

  if (!dataset || dataset.slug !== decodeURIComponent(slug)) {
    return notFound();
  }

  return (
    <Main className={"content space-y-6"}>
      <div className={"space-y-8"}>
        <DatasetTitleGroup dataset={dataset} />

        <DatasetTabs dataset={dataset} />
      </div>
    </Main>
  );
}
