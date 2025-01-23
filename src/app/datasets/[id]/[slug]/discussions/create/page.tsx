import { unauthorized } from "next/navigation";

import { auth } from "@/auth";
import DiscussionCreateInput from "@/components/dataset/tabs/discussions/create/DiscussionCreateInput";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  return <DiscussionCreateInput datasetId={Number(id)} />;
}
