import type { Metadata } from "next";
import { forbidden } from "next/navigation";

import { auth, signIn } from "@/auth";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { Main } from "@/components/layout/Main";
import { Enums } from "@/db/lib/enums";
import { ADMIN_ROUTE } from "@/lib/routes";
import { isPriviliged } from "@/server/trpc/middleware/lib/roles";
import { caller } from "@/server/trpc/query/server";

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

  const initialDatasetCount = await caller.dataset.find.privilegedCountByQuery({
    status: [Enums.ApprovalStatus.PENDING],
  });

  const initialEditCount = await caller.edit.find.countByQuery({
    status: [Enums.EditStatus.PENDING],
  });

  const initialReportCount = await caller.report.find.countAll({});

  return (
    <Main className="space-y-8">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <AdminTabs
          role={session.user.role}
          initialDatasetCount={initialDatasetCount}
          initialEditCount={initialEditCount}
          initialReportCount={initialReportCount}
        />
      </div>
      {children}
    </Main>
  );
}
