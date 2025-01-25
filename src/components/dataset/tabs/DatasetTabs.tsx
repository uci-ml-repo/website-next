"use client";

import { usePathname } from "next/navigation";
import path from "path";
import React from "react";

import DatasetInteractions from "@/components/dataset/interactions/DatasetInteractions";
import {
  LinearTabs,
  LinearTabsList,
  LinearTabsTrigger,
  TabsListBorder,
} from "@/components/ui/linear-tabs";
import type { DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DatasetTabsProps {
  basePath: string;
  dataset: DatasetResponse;
  children: React.ReactNode;
}

export default function DatasetTabs({
  basePath,
  dataset,
  children,
}: DatasetTabsProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const activeTab = segments[3] || "about";

  const discussionCountQuery = trpc.discussion.count.byDatasetId.useQuery(
    dataset.id,
  );

  const discussionCount = discussionCountQuery?.data ?? null;

  return (
    <LinearTabs
      defaultValue={activeTab}
      routerStore={basePath}
      routerSegment={3}
    >
      <div className="flex items-center justify-between space-x-6 overflow-x-auto px-1">
        <LinearTabsList className="space-x-8">
          <LinearTabsTrigger value="about" link={path.join(basePath, "about")}>
            About
          </LinearTabsTrigger>

          {!dataset.externalLink && (
            <LinearTabsTrigger
              value="files"
              link={path.join(basePath, "files")}
            >
              Files
            </LinearTabsTrigger>
          )}

          <LinearTabsTrigger
            value="discussions"
            badgeValue={discussionCount}
            link={path.join(basePath, "discussions")}
          >
            Discussions
          </LinearTabsTrigger>
        </LinearTabsList>

        <DatasetInteractions dataset={dataset} className="max-md:hidden" />
      </div>

      <TabsListBorder />

      {children}
    </LinearTabs>
  );
}
