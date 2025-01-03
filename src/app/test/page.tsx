"use client";

import Image from "next/image";

import Main from "@/components/layout/Main";

export default function TestPage() {
  return (
    <Main>
      <div className="flex h-[100px] flex-col">
        <div className="sticky top-0 h-[20px] bg-uci-gold" />
        <div className="relative flex flex-1 items-center justify-center bg-destructive">
          <Image
            src="http://localhost:3000/api/static/public/45/heart+disease/5-5000x33340r.jpg"
            alt="Descriptive Alt Text"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
      </div>
    </Main>
  );
}
