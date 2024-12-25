"use client";

import { useState } from "react";

import DatasetAbout from "@/components/dataset/page/tabs/about/DatasetAbout";
import DatasetActivity from "@/components/dataset/page/tabs/about/DatasetActivity";
import DatasetDiscussion from "@/components/dataset/page/tabs/discussion/DatasetDiscussion";
import DatasetFiles from "@/components/dataset/page/tabs/files/DatasetFiles";
import { Badge } from "@/components/ui/badge";
import {
  LinearTabsContent,
  LinearTabsList,
  LinearTabsRoot,
  LinearTabsTrigger,
} from "@/components/ui/linear-tabs";
import type { DatasetResponse } from "@/lib/types";

export default function DatasetTabs({ dataset }: { dataset: DatasetResponse }) {
  const [tab, setTab] = useState("about");

  return (
    <LinearTabsRoot value={tab} onValueChange={setTab}>
      <div className={"flex items-center justify-between space-x-8"}>
        <LinearTabsList className={"space-x-10 overflow-x-auto"} value={tab}>
          <LinearTabsTrigger value={"about"}>About</LinearTabsTrigger>
          <LinearTabsTrigger value={"files"}>Files</LinearTabsTrigger>
          <LinearTabsTrigger
            value={"discussion"}
            className={"flex items-center space-x-2"}
          >
            <span>Discussion</span>
            <Badge variant={"secondary"}>0</Badge>
          </LinearTabsTrigger>
        </LinearTabsList>
        <DatasetActivity dataset={dataset} className={"max-md:hidden"} />
      </div>
      <hr className={"-mt-[2px] mb-6 border-[1px]"} />

      <LinearTabsContent value={"about"}>
        <DatasetAbout dataset={dataset} />
      </LinearTabsContent>
      <LinearTabsContent value={"files"}>
        <DatasetFiles dataset={dataset} />
      </LinearTabsContent>
      <LinearTabsContent value={"discussion"}>
        <DatasetDiscussion dataset={dataset} />
      </LinearTabsContent>
    </LinearTabsRoot>
  );
}
