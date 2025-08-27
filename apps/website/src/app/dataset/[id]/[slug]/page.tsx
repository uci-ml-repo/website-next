import { DatasetAbout } from "@/components/dataset/view/about/dataset-about";
import { trpc } from "@/server/trpc/query/server";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  const dataset = await trpc.dataset.find.byId({ datasetId: id });

  return <DatasetAbout dataset={dataset} />;
}
