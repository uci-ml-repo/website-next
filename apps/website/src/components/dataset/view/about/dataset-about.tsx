"use client";

import { trpc } from "@/server/trpc/query/client";

export function DatasetAbout({ id }: { id: number }) {
  const { data: dataset } = trpc.dataset.find.byId.useQuery({ datasetId: id });

  if (!dataset) throw new Error("Dataset should be prefetched");

  const AboutSection = ({ title, text }: { title: string; text: string }) => (
    <div className="space-y-2">
      <div className="text-xl font-bold">{title}</div>
      <div className="whitespace-pre-wrap">{text}</div>
    </div>
  );

  return (
    <div className="space-y-8">
      <AboutSection title="About" text={dataset.description} />
    </div>
  );
}
