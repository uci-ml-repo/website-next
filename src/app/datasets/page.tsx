import type { Metadata } from "next";

import DatasetsSearchPreview from "@/components/datasets/DatasetsSearchPreview";
import Main from "@/components/layout/Main";

export const metadata: Metadata = { title: "Datasets" };

export default function Page() {
  return (
    <Main>
      <DatasetsSearchPreview />
    </Main>
  );
}
