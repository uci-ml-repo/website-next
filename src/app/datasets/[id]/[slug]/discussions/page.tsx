import DatasetDiscussions from "@/components/dataset/tabs/discussions/Discussions";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const dataset = await caller.dataset.find.byId(Number((await params).id));

  return <DatasetDiscussions datasetId={dataset!.id} />;
}
