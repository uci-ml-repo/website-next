import { Button } from "@components/ui/button";
import { ROUTES } from "@lib/routes";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="blur-background">
      <div>{children}</div>
      <div className="space-y-8">
        <hr />
        <Button variant="secondary" size="lg" className="lift w-full sm:w-fit" asChild>
          <Link href={ROUTES.HOME}>
            <ArrowLeftIcon />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
