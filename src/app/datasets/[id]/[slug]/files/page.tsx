import Files from "@/components/dataset/tabs/files/Files";
import { caller } from "@/server/trpc/query/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const dataset = await caller.dataset.find.byId(Number((await params).id));
  return <Files dataset={dataset!} />;
}
