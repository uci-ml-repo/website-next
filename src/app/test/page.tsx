"use client";

import Main from "@/components/layout/Main";

export default function Test() {
  return (
    <Main>
      <div className="bg-stripes">
        <div className="gradient-blur relative z-10 inline-block rounded-lg p-8">
          <h1 className="text-4xl font-bold">Readable Text</h1>
          <p className="mt-4">
            This text is now easier to read thanks to the gradient blur effect
            behind it.
          </p>
        </div>
      </div>
    </Main>
  );
}
