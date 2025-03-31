import { unauthorized } from "next/navigation";

import { auth } from "@/auth";
import { VerificationError } from "@/components/auth/VerificationError";
import { DiscussionCreateForm } from "@/components/discussion/create/DiscussionCreateForm";

export default async function Page({ params }: { params: Promise<{ id: string; slug: string }> }) {
  const { id, slug } = await params;
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  if (!session.user.emailVerified) {
    return <VerificationError />;
  }

  return <DiscussionCreateForm datasetId={Number(id)} datasetSlug={slug} />;
}
