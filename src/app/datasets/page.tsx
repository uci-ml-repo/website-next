import type { Metadata } from "next";

import DatasetsFilters from "@/components/datasets/DatasetsFilters";
import DatasetsSearch from "@/components/datasets/DatasetsSearch";
import Main from "@/components/layout/Main";

export const metadata: Metadata = { title: "Datasets" };

export default function Page() {
  return (
    <Main>
      <div className="backdrop-gradient-blur flex space-x-4">
        <div className="w-72 max-lg:hidden">
          <DatasetsFilters />
        </div>
        <DatasetsSearch />
      </div>
    </Main>
  );
}
