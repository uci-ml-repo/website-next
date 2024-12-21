import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";

import { DatasetMetadata } from "@/components/dataset/page/DatasetMetadata";
import DatasetQuickStats from "@/components/dataset/page/DatasetQuickStats";
import DatasetSideData from "@/components/dataset/page/DatasetSideData";
import DatasetTitleGroup from "@/components/dataset/page/DatasetTitleGroup";
import Main from "@/components/layout/Main";
import { caller } from "@/server/trpc/server";

const getDataset = cache(async (id: number) => {
  return caller.datasets.findById(id);
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

        <hr />

        <div className={"space-y-16"}>
          <div
            className={"flex justify-between gap-x-14 gap-y-10 max-lg:flex-col"}
          >
            <div className={"w-full space-y-8"}>
              <div className={"space-y-2"}>
                <h2 className={"text-2xl font-bold"}>About Dataset</h2>
                <div className={"break-words"}>{dataset.description}</div>
              </div>
              <DatasetQuickStats dataset={dataset} />
              <hr className={"lg:hidden"} />
            </div>

            <DatasetSideData dataset={dataset} />
          </div>

          {/* Metadata */}
          <DatasetMetadata dataset={dataset} />
        </div>
      </div>
    </Main>
  );
}
