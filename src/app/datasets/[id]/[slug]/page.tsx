import { notFound } from "next/navigation";

import service from "@/server/service";

export default async function Page({
  params,
}: {
  params: Promise<{ id: number; slug: string }>;
}) {
  const { id, slug } = await params;
  const dataset = await service.datasets.find.byId(Number(id));

  if (!dataset || dataset.slug !== decodeURIComponent(slug)) {
    return notFound();
  }

  return (
    <div>
      <h1>{dataset.title}</h1>
      <p>{dataset.abstract}</p>
    </div>
  );
}
