import { DatasetAbout } from "@/components/dataset/view/about/dataset-about";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  return <DatasetAbout datasetId={id} />;
}
