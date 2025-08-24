import { DatasetFeatures } from "@/components/dataset/view/features/dataset-features";

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id: _id } = await params;
  const id = Number(_id);

  return <DatasetFeatures datasetId={id} />;
}
