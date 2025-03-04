import { forbidden, unauthorized } from "next/navigation";

import { auth } from "@/auth";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";
import { caller } from "@/server/trpc/query/server";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string; slug: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    return unauthorized();
  }

  const { id } = await params;
  const dataset = await caller.dataset.find.byId({ datasetId: Number(id) });

  if (
    !isPriviliged(session?.user.role) &&
    dataset.userId !== session?.user.id
  ) {
    return forbidden();
  }

  return children;
}
