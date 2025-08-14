import { DatasetViewAbout } from "@/components/dataset/view/about/dataset-view-about";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);

  return <DatasetViewAbout id={id} />;
}
