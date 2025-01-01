"use client";

import Main from "@/components/layout/Main";
import { trpc } from "@/server/trpc/query/client";

export default function TestPage() {
  const res = trpc.files.find.list.useQuery({
    path: "/private",
  });

  return <Main />;
}
