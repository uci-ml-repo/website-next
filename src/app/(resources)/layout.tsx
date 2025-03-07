import "@/app/globals.css";

import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Main } from "@/components/layout/Main";
import { Button } from "@/components/ui/button";
import { HOME_ROUTE } from "@/lib/routes";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Main className="space-y-12">
      <div className="backdrop-gradient-blur">{children}</div>
      <div className="space-y-8">
        <hr />
        <Button
          variant="secondary"
          size="lg"
          className="lift w-full sm:w-fit"
          asChild
        >
          <Link href={HOME_ROUTE}>
            <ArrowLeftIcon />
            Return Home
          </Link>
        </Button>
      </div>
    </Main>
  );
}
