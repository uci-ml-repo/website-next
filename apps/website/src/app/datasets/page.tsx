import type { Metadata } from "next";

import { DatasetSearchFiltersDesktop } from "@/components/dataset/search/filter/dataset-search-filters-desktop";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Datasets",
  description: "Browse datasets from the UCI Machine Learning Repository.",
  alternates: { canonical: ROUTES.SEARCH },
};

export default function Page() {
  return (
    <div className="flex space-x-6">
      <DatasetSearchFiltersDesktop />
      <div>Results</div>
    </div>
  );
}
