"use client";

import { trpc } from "@/server/trpc/query/client";

export function DatasetViewAbout({ id }: { id: number }) {
  const { data: dataset } = trpc.dataset.find.byId.useQuery({ id });

  if (!dataset) throw new Error();

  return <div>{dataset.description}</div>;
}
