"use client";

import type { Session } from "@packages/auth/auth";
import Image from "next/image";
import type { HTMLAttributes } from "react";

import { DatasetCitationButton } from "@/components/dataset/view/header/button/dataset-citation-button";
import { DatasetDownloadButton } from "@/components/dataset/view/header/button/dataset-download-button";
import { DatasetInteractions } from "@/components/dataset/view/header/dataset-interactions";
import { useSessionWithInitial } from "@/components/hooks/use-session-with-initial";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

import { DatasetExternalLinkButton } from "./button/dataset-external-link-button";
import { DatasetPythonButton } from "./button/dataset-python-button";

type Props = HTMLAttributes<HTMLDivElement> & {
  dataset: { id: number };
  session: Session | null;
};

export function DatasetHeader({ dataset: _dataset, session: _session }: Props) {
  const { data: dataset } = trpc.dataset.find.byId.useQuery({ datasetId: _dataset.id });
  if (!dataset) throw new Error("dataset should be prefetched");

  const session = useSessionWithInitial(_session);

  return (
    <div className="flex gap-x-8">
      <div className="w-full space-y-4">
        <h1 className="line-clamp-2 text-3xl font-bold">{dataset.title}</h1>
        <div className="flex gap-x-2 gap-y-3 max-sm:flex-wrap max-sm:*:w-full">
          {dataset.externalLink ? (
            <DatasetExternalLinkButton dataset={dataset} />
          ) : (
            <DatasetDownloadButton dataset={dataset} />
          )}
          <DatasetCitationButton dataset={dataset} />
          {dataset.isAvailablePython && <DatasetPythonButton dataset={dataset} />}
          <Card className="rounded-full sm:hidden">
            <DatasetInteractions
              dataset={dataset}
              session={session}
              className="justify-around px-2 py-0.5"
            />
          </Card>
        </div>
      </div>
      {dataset.hasGraphics && (
        <Image
          src={ROUTES.DATASET.THUMBNAIL(dataset)}
          height={100}
          width={275}
          alt="Thumbnail"
          className="h-[5.5rem] w-[16rem] shrink-0 rounded-2xl object-cover object-center max-xl:hidden"
          priority
        />
      )}
    </div>
  );
}
