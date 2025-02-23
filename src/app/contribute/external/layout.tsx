import type { Metadata } from "next";

import { auth, signIn } from "@/auth";
import { Main } from "@/components/layout/Main";
import { CONTRIBUTE_EXTERNAL_ROUTE } from "@/lib/routes";

export const metadata: Metadata = { title: "Link External" };

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session.user) {
    return signIn(undefined, { redirectTo: CONTRIBUTE_EXTERNAL_ROUTE });
  }

  return <Main>{children}</Main>;
}
