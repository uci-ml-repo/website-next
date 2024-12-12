import { notFound } from "next/navigation";

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

  return (
    <main className={"content"}>
      <h1>{dataset.title}</h1>
      <p>{dataset.abstract}</p>
    </main>
  );
}
