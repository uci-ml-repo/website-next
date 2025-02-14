"use client";

import * as React from "react";

import { Main } from "@/components/layout/Main";

export default function Test() {
  return (
    <Main>
      <button onClick={() => console.log(Date.now())}> X</button>
    </Main>
  );
}
