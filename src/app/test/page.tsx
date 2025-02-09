"use client";

import { Main } from "@/components/layout/Main";

export default function Test() {
  return (
    <Main>
      <div className="flex h-screen flex-col">
        <div className="h-20 bg-green-500">Top</div>
        <div className="flex-grow overflow-y-auto bg-red-500">
          <div className="text-6xl">Middle</div>
          <div className="text-6xl">Middle</div>
          <div className="text-6xl">Middle</div>
        </div>
        <div className="h-20 bg-green-500">Bottom</div>
      </div>
    </Main>
  );
}
