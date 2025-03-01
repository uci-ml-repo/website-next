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

interface DatasetTabsProps {
  dataset: DatasetResponse;
  discussionCount: number;
}

export function DatasetTabs({ dataset, discussionCount }: DatasetTabsProps) {
  const basePath = DATASET_ROUTE(dataset);

  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const activeTab = segments[3] || "about";

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
