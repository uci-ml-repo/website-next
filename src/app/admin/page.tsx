import type { Metadata } from "next";

import Main from "@/components/layout/Main";

export const metadata: Metadata = {
  title: "Admin",
};

export default function Page() {
  return <Main>ADMIN</Main>;
}
