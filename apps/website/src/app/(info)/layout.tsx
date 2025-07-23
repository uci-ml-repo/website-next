import { Button } from "@components/ui/button";
import { ROUTES } from "@website/lib/routes";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="backdrop-blur">{children}</div>
      <div className="space-y-8">
        <hr />
        <Button variant="secondary" size="lg" className="lift w-full sm:w-fit" asChild>
          <Link href={ROUTES.HOME}>
            <ArrowLeftIcon />
            Return Home
          </Link>
        </Button>
      </div>
    </>
  );
}
