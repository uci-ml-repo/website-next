"use client";

import { trpc } from "@/server/trpc/query/client";

export function DatasetViewAbout({ id }: { id: number }) {
  const { data: dataset } = trpc.dataset.find.byId.useQuery({ id });

  if (!dataset) throw new Error();

  return (
    <div className="space-y-2">
      <div className="text-2xl font-bold">About</div>
      <div>{dataset.description}</div>
    </div>
  );
}
