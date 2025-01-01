import type { Metadata } from "next";

import Main from "@/components/layout/Main";
import {
  LinearTabs,
  LinearTabsContent,
  LinearTabsList,
  LinearTabsTrigger,
  TabsListBorder,
} from "@/components/ui/linear-tabs";

export const metadata: Metadata = {
  title: "Admin",
};

export default function Page() {
  return (
    <Main className="space-y-6">
      <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
      <LinearTabs defaultValue="overview">
        <LinearTabsList className="space-x-10 overflow-x-auto" variant="gold">
          <LinearTabsTrigger value="overview">Overview</LinearTabsTrigger>
          <LinearTabsTrigger value="datasets" badgeValue={0}>
            Datasets
          </LinearTabsTrigger>
        </LinearTabsList>
        <TabsListBorder />

        <LinearTabsContent value="overview">OVERVIEW</LinearTabsContent>
        <LinearTabsContent value="datasets">DATASETS</LinearTabsContent>
      </LinearTabs>
    </Main>
  );
}
