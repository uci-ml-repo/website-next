import type { Metadata } from "next";

import { DatasetFiltersDesktop } from "@/components/datasets/DatasetFiltersDesktop";
import { DatasetSearch } from "@/components/datasets/DatasetSearch";
import { Main } from "@/components/layout/Main";

export const metadata: Metadata = { title: "Datasets" };

export default function Page() {
  return (
    <Main>
      <div className="backdrop-gradient-blur flex">
        <div className="mr-4 w-60 max-lg:hidden xl:w-72">
          <DatasetFiltersDesktop />
        </div>
        <DatasetSearch />
      </div>
    </Main>
  );
}
