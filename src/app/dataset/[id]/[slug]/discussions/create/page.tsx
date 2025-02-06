import { unauthorized } from "next/navigation";

import { auth } from "@/auth";
import VerificationError from "@/components/auth/VerificationError";
import DiscussionCreateInput from "@/components/discussion/create/DiscussionCreateInput";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id, slug } = await params;
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  if (!session.user.emailVerified) {
    return <VerificationError />;
  }

  return <DiscussionCreateInput datasetId={Number(id)} datasetSlug={slug} />;
}
