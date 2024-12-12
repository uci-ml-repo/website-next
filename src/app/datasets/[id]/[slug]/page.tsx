import Image from "next/image";
import { notFound } from "next/navigation";

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
    <main className={"content"}>
      <div className={"space-y-2"}>
        <h1 className={"text-4xl font-bold"}>{dataset.title}</h1>
        <h2 className={"text-xl"}>{dataset.subtitle}</h2>
      </div>
      <Image src={thumbnail} width={10} height={10} alt={dataset.title} />
    </main>
  );
}
