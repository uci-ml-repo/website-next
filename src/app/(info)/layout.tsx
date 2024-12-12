import "@/app/globals.css";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { HOME_PATH } from "@/globals";

export default function MdxLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className={"content space-y-12"}>
      <div>{children}</div>
      <div className={"space-y-8"}>
        <hr />
        <Button
          variant={"blue"}
          size={"lg"}
          className={"lift w-full sm:w-fit"}
          asChild
          pill
        >
          <Link href={HOME_PATH}>
            <ArrowLeftIcon />
            Return Home
          </Link>
        </Button>
      </div>
    </main>
  );
}
