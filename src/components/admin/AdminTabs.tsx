"use client";

import { usePathname } from "next/navigation";
import path from "path";

import {
  LinearTabs,
  LinearTabsList,
  LinearTabsTrigger,
  TabsListBorder,
} from "@/components/ui/linear-tabs";
import { Enums } from "@/db/lib/enums";
import { ADMIN_ROUTE } from "@/lib/routes";
import { trpc } from "@/server/trpc/query/client";

export function AdminTabs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const activeTab = segments[1] || "overview";

  const { data: datasetCount } =
    trpc.dataset.find.privilegedCountByQuery.useQuery({
      status: Enums.ApprovalStatus.PENDING,
    });

  const { data: userCount } = trpc.user.find.countByQuery.useQuery({});

  return (
    <LinearTabs
      defaultValue={activeTab}
      routerStore={ADMIN_ROUTE}
      routerSegment={3}
    >
      <div className="flex items-center justify-between space-x-6 overflow-x-auto px-1">
        <LinearTabsList className="space-x-8">
          <LinearTabsTrigger
            value="overview"
            link={path.join(ADMIN_ROUTE, "overview")}
          >
            Overview
          </LinearTabsTrigger>

          <LinearTabsTrigger
            value="datasets"
            badgeValue={datasetCount ?? null}
            link={path.join(ADMIN_ROUTE, "datasets")}
          >
            Datasets
          </LinearTabsTrigger>

          <LinearTabsTrigger
            value="edits"
            badgeValue={0}
            link={path.join(ADMIN_ROUTE, "edits")}
          >
            Edits
          </LinearTabsTrigger>

          <LinearTabsTrigger
            value="users"
            badgeValue={userCount ?? null}
            link={path.join(ADMIN_ROUTE, "users")}
          >
            Users
          </LinearTabsTrigger>

          <LinearTabsTrigger
            value="reports"
            badgeValue={0}
            link={path.join(ADMIN_ROUTE, "reports")}
          >
            Reports
          </LinearTabsTrigger>
        </LinearTabsList>
      </div>

      <TabsListBorder />
    </LinearTabs>
  );
}
