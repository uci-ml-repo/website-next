import type { Metadata } from "next";
import { forbidden } from "next/navigation";

import { auth, signIn } from "@/auth";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { Main } from "@/components/layout/Main";
import { ADMIN_ROUTE } from "@/lib/routes";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session || !session.user) {
    return signIn(undefined, { redirectTo: ADMIN_ROUTE });
  }

  if (!isPriviliged(session.user.role)) {
    return forbidden();
  }

  return (
    <Main className="space-y-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <AdminTabs role={session.user.role} />
      </div>
      {children}
    </Main>
  );
}
