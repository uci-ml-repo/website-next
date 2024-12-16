import { BookMarkedIcon } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

import DatasetDownload from "@/components/dataset/interactions/DatasetDownload";
import DatasetPython from "@/components/dataset/interactions/DatasetPython";
import Main from "@/components/layout/Main";
import { Button } from "@/components/ui/button";
import { datasetThumbnail } from "@/lib/utils";
import { caller } from "@/server/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;

  const dataset = await caller.datasets.findById(Number(id));

  if (!dataset || dataset.slug !== decodeURIComponent(slug)) {
    return notFound();
  }

  const thumbnail = datasetThumbnail(dataset);

  return (
    <Main className={"content"}>
      <div className={"flex items-center justify-between"}>
        <div className={"space-y-2"}>
          <h1 className={"text-4xl font-bold text-foreground"}>
            {dataset.title}
          </h1>
          {dataset.subtitle && (
            <p className={"text-xl text-muted-foreground"}>
              {dataset.subtitle}
            </p>
          )}
        </div>
        <Image
          src={thumbnail}
          width={300}
          height={120}
          alt={"thumbnail"}
          className={
            "ml-8 h-[120px] w-[300px] shrink-0 rounded-2xl object-cover object-center"
          }
        />
      </div>
      <div className={"w-80 space-y-2"}>
        <DatasetDownload dataset={dataset} />
        <DatasetPython dataset={dataset} />
        <Button
          pill
          variant={"secondary"}
          className={"lift w-full"}
          size={"lg"}
        >
          <BookMarkedIcon />
          <div>Cite Dataset</div>
        </Button>
      </div>
    </Main>
  );
}
