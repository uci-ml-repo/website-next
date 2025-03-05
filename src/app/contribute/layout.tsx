import type { Metadata } from "next";

import { Main } from "@/components/layout/Main";

export const metadata: Metadata = {
  title: "Contribute",
  description: "Contribute a dataset to the UCI Machine Learning Repository.",
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Main className="!max-w-4xl">{children}</Main>;
}
