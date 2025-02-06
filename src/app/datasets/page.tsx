import type { Metadata } from "next";

import DatasetsSearch from "@/components/datasets/DatasetsSearch";
import Main from "@/components/layout/Main";

export const metadata: Metadata = { title: "Datasets" };

export default function Page() {
  return (
    <Main>
      <DatasetsSearch />
    </Main>
  );
}
