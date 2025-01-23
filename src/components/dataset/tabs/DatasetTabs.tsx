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

interface DatasetTabsProps {
  basePath: string;
  dataset: DatasetResponse;
  discussionsCount: number;
  children: React.ReactNode;
}

export default function DatasetTabs({
  basePath,
  dataset,
  discussionsCount,
  children,
}: DatasetTabsProps) {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const activeTab = segments[3] || "about";

  return (
    <LinearTabs defaultValue={activeTab} routerStore={basePath}>
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
            badgeValue={discussionsCount}
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
