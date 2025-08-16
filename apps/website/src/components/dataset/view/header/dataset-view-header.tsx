"use client";

import Image from "next/image";

import { DatasetDownloadButton } from "@/components/dataset/view/header/button/dataset-download-button";
import { ROUTES } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

import { DatasetExternalLinkButton } from "./button/dataset-external-link-button";
import { DatasetPythonButton } from "./button/dataset-python-button";

interface Props {
  id: number;
}

export function DatasetViewHeader({ id }: Props) {
  const { data: dataset } = trpc.dataset.find.byId.useQuery({ id });

  if (!dataset) throw new Error("Dataset should be prefetched");

  return (
    <div className="flex gap-x-8">
      <div className="w-full space-y-4">
        <h1 className="line-clamp-2 text-3xl font-bold">{dataset.title}</h1>
        <div className="flex gap-x-4">
          {dataset.externalLink ? (
            <DatasetExternalLinkButton dataset={dataset} />
          ) : (
            <DatasetDownloadButton dataset={dataset} />
          )}
          <div>X</div>
          {dataset.isAvailablePython && <DatasetPythonButton dataset={dataset} />}
        </div>
      </div>
      {dataset.hasGraphics && (
        <Image
          src={ROUTES.DATASET.THUMBNAIL(dataset)}
          height={100}
          width={275}
          alt="Thumbnail"
          className="max-2lg:hidden h-[6rem] w-[16rem] shrink-0 rounded-2xl object-cover object-center"
        />
      )}
    </div>
  );
}
