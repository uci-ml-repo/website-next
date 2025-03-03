"use client";

import { usePathname } from "next/navigation";
import path from "path";
import React from "react";

import { DatasetInteractions } from "@/components/dataset/interactions/DatasetInteractions";
import {
  LinearTabs,
  LinearTabsList,
  LinearTabsTrigger,
  TabsListBorder,
} from "@/components/ui/linear-tabs";
import { DATASET_ROUTE } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";
import { trpc } from "@/server/trpc/query/client";

interface DatasetTabsProps {
  dataset: DatasetResponse;
  initialDiscussionCount: number;
}

export function DatasetTabs({
  dataset,
  initialDiscussionCount,
}: DatasetTabsProps) {
  const basePath = DATASET_ROUTE(dataset);

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const activeTab = segments[3] || "about";

  const { data: discussionCount } = trpc.discussion.find.countByQuery.useQuery(
    {
      datasetId: dataset.id,
    },
    {
      placeholderData: initialDiscussionCount,
    },
  );

  return (
    <LinearTabs
      defaultValue={activeTab}
      routerStore={basePath}
      routerSegment={3}
    >
      <div className="flex items-center justify-between space-x-6 overflow-x-auto">
        <LinearTabsList>
          <LinearTabsTrigger value="about" link={path.join(basePath, "about")}>
            About
          </LinearTabsTrigger>

          {!dataset.externalLink && (
            <LinearTabsTrigger
              value="files"
              badgeValue={dataset.fileCount ?? undefined}
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
    </LinearTabs>
  );
}
