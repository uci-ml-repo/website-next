import { DatasetFiles } from "@/components/dataset/view/files/dataset-files";

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id: _id } = await params;
  const id = Number(_id);

  return <DatasetFiles datasetId={id} />;
}
