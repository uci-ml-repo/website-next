import { auth } from "@packages/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { NavTabs } from "@/components/ui/nav-tabs";
import { ROUTES } from "@/lib/routes";
import { isPrivileged } from "@/server/trpc/middleware/util/role";

export const metadata: Metadata = {
  title: "Admin",
};

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect(ROUTES.AUTH.SIGN_IN());
  }

  if (!isPrivileged(session.user.role)) {
    forbidden();
  }

  return (
    <div className="blur-background space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Admin</h1>
        <NavTabs
          aria-label="Admin tabs"
          tabs={[
            { display: "Datasets", path: ROUTES.ADMIN.DATASETS },
            { display: "Edits", path: ROUTES.ADMIN.EDITS },
            { display: "Users", path: ROUTES.ADMIN.USERS },
          ]}
        />
      </div>
      {children}
    </div>
  );
}
