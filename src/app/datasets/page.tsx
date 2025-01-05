import type { Metadata } from "next";

import Main from "@/components/layout/Main";

export const metadata: Metadata = { title: "Datasets" };

export default function Page() {
  return (
    <Main className="flex">
      <div>Filters</div>
      <div>Search</div>
    </Main>
  );
}
