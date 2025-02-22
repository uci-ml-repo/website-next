import type { Metadata } from "next";
import { forbidden } from "next/navigation";

import { auth, signIn } from "@/auth";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { Main } from "@/components/layout/Main";
import { Enums } from "@/db/lib/enums";
import { ADMIN_ROUTE } from "@/lib/routes";

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

  if (session.user.role !== Enums.UserRole.ADMIN) {
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
