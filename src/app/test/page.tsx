"use client";

import { useSearchParams } from "next/navigation";
import * as React from "react";

import { Main } from "@/components/layout/Main";

export default function Test() {
  const params = useSearchParams();
  return (
    <Main>
      <div>{typeof params.entries()}</div>
      <div>{JSON.stringify(Array.from(params.entries()))}</div>
    </Main>
  );
}
