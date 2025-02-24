"use client";

import * as React from "react";

import { Main } from "@/components/layout/Main";
import { trpc } from "@/server/trpc/query/client";

export default function Test() {
  const { data } = trpc.file.read.zipStats.useQuery({
    path: "/public/42.zip",
  });

  return <Main>{JSON.stringify(data)}</Main>;
}
