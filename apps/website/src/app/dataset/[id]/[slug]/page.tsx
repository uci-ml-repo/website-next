import { DatasetViewHeader } from "@/components/dataset/view/dataset-view-header";
import { HydrateClient, trpc } from "@/server/trpc/query/server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  await trpc.dataset.find.byId.prefetch({ id });

  return <div>CONTENT</div>;
}
