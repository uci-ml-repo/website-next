import { auth } from "@packages/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { forbidden, redirect } from "next/navigation";
import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { NavTabs } from "@/components/ui/nav-tabs";
import { ROUTES } from "@/lib/routes";
import { service } from "@/server/service";
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

  const pendingCount = await service.dataset.stat.pendingCount();

  return (
    <div className="blur-background space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold md:text-3xl">Admin</h1>
        <NavTabs
          aria-label="Admin tabs"
          tabs={[
            {
              display: (
                <span className="inline-flex items-center gap-1.5">
                  Datasets
                  {pendingCount > 0 && (
                    <Badge
                      variant="blue"
                      size="sm"
                      className="pointer-events-none tabular-nums"
                      aria-label={`${pendingCount} pending`}
                    >
                      {pendingCount}
                    </Badge>
                  )}
                </span>
              ),
              path: ROUTES.ADMIN.ROOT,
            },
            { display: "Edits", path: ROUTES.ADMIN.EDITS },
            { display: "Users", path: ROUTES.ADMIN.USERS },
          ]}
        />
      </div>
      {children}
    </div>
  );
}
