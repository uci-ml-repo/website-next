import type { Metadata } from "next";

import { DatasetSearchFiltersDesktop } from "@/components/dataset/search/filter/dataset-search-filters-desktop";

export const metadata: Metadata = {
  title: "Datasets",
  description: "Browse datasets from the UCI Machine Learning Repository.",
};

export default function Page() {
  return (
    <div className="flex space-x-6">
      <DatasetSearchFiltersDesktop />
      <div>Results</div>
    </div>
  );
}
