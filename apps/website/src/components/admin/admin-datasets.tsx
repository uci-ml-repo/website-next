"use client";

import { DatasetSearchResults } from "@/components/dataset/search/dataset-search-results";
import {
  ADMIN_DATASET_ORDER,
  adminDatasetOrderOptions,
  DatasetFilterOrder,
} from "@/components/dataset/search/filter/item/dataset-filter-order";
import { DatasetFilterSearch } from "@/components/dataset/search/filter/item/dataset-filter-search";

import { AdminDatasetFiltersDesktop, AdminDatasetFiltersMobile } from "./admin-dataset-filters";

export function AdminDatasets() {
  return (
    <div className="flex space-x-6">
      <AdminDatasetFiltersDesktop className="max-xl:hidden" />
      <div className="flex grow flex-col">
        <div className="space-y-2">
          <div className="flex items-end gap-3 max-md:flex-col">
            <DatasetFilterSearch />
            <div className="flex items-end justify-between gap-x-3 max-md:w-full">
              <AdminDatasetFiltersMobile />
              <div className="flex flex-col gap-1 max-md:flex-row max-md:items-center">
                <div className="text-muted-foreground max-2xs:hidden">Order by:</div>
                <DatasetFilterOrder
                  options={adminDatasetOrderOptions}
                  defaultOrder={ADMIN_DATASET_ORDER}
                  enableRelevance={false}
                />
              </div>
            </div>
          </div>

          <DatasetSearchResults privileged />
        </div>
      </div>
    </div>
  );
}
