import type { Metadata } from "next";

import { DatasetSearch } from "@/components/datasets/DatasetSearch";
import { Main } from "@/components/layout/Main";

export const metadata: Metadata = {
  title: "Datasets",
  description: "Browse datasets from the UCI Machine Learning Repository.",
};

export default function Page() {
  return (
    <Main className="h-[calc(100svh-var(--header-height))]">
      <DatasetSearch />
    </Main>
  );
}
