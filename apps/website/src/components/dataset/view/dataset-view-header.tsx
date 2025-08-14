"use client";

import Image from "next/image";

import { ROUTES } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

interface Props {
  id: number;
}

export function DatasetViewHeader({ id }: Props) {
  const { data: dataset } = trpc.dataset.find.byId.useQuery({ id });

  if (!dataset) throw new Error("Dataset should be prefetched");

  return (
    <div className="flex items-center gap-x-8">
      <div className="w-full space-y-2">
        <h1 className="text-3xl font-bold">{dataset.title}</h1>
        <div className="flex gap-x-4">
          <div>X</div>
          <div>X</div>
          <div>X</div>
        </div>
      </div>
      {dataset.hasGraphics && (
        <Image
          src={ROUTES.DATASET.THUMBNAIL(dataset)}
          height={100}
          width={275}
          alt="Thumbnail"
          className="max-2lg:hidden h-[6rem] w-[16rem] shrink-0 rounded-2xl border-2 object-cover object-center"
        />
      )}
    </div>
  );
}
