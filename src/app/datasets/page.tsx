import type { Metadata } from "next";

import { DatasetSearch } from "@/components/datasets/DatasetSearch";
import { Main } from "@/components/layout/Main";

export const metadata: Metadata = {
  title: "Datasets",
  description:
    "Browse hundreds of datasets from the UCI Machine Learning Repository.",
};

export default function Page() {
  return (
    <Main>
      <div className="backdrop-gradient-blur">
        <DatasetSearch />
      </div>
    </Main>
  );
}
