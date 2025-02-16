import type { Metadata } from "next";

import { DatasetFiltersDesktop } from "@/components/datasets/DatasetFiltersDesktop";
import { DatasetSearch } from "@/components/datasets/DatasetSearch";
import { Main } from "@/components/layout/Main";

export const metadata: Metadata = { title: "Datasets" };

export default function Page() {
  return (
    <Main>
      <div className="backdrop-gradient-blur flex">
        <div className="mr-4 w-72 max-xl:hidden">
          <DatasetFiltersDesktop />
        </div>
        <DatasetSearch />
      </div>
    </Main>
  );
}
