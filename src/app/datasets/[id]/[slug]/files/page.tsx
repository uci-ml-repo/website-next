import Files from "@/components/dataset/page/tabs/files/Files";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const dataset = await caller.datasets.find.byId(Number((await params).id));
  return <Files dataset={dataset!} />;
}
