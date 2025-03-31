import { ArrowRightIcon, EllipsisIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OverviewCardProps {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  href: string;
}

export function OverviewCard({ title, icon, children, href }: OverviewCardProps) {
  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden",
        "lift-transition will-change-transform",
        "has-[.parent-lift:hover]:scale-[1.01] has-[.parent-lift:hover]:shadow-md",
        "ring-ring has-[.parent-lift:focus]:scale-[1.01] has-[.parent-lift:focus]:shadow-md has-[.parent-lift:focus-visible]:ring-2",
      )}
    >
      <Link
        href={href}
        className="parent-lift group hover:bg-accent focus:bg-accent focus:outline-none"
      >
        <CardTitle className="flex items-center justify-between p-3">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="group-hover:underline">{title}</span>
          </div>
          <ArrowRightIcon />
        </CardTitle>
      </Link>
      {children && (
        <>
          <hr />
          <CardContent className="flex min-h-32 flex-1 flex-col bg-muted p-2">
            {children}
          </CardContent>
        </>
      )}
    </Card>
  );
}

export function OverviewCardViewMore({ href, text }: { href: string; text: string }) {
  return (
    <div className="flex flex-1 items-end">
      <Link
        href={href}
        className="flex w-fit items-center space-x-2 px-1.5 text-muted-foreground hover:underline"
      >
        <EllipsisIcon className="size-7" />
        <span>{text}</span>
        <ArrowRightIcon className="size-4" />
      </Link>
    </div>
  );
}

export function OverviewCardAlternativeButton({
  href,
  description,
  buttonText,
  buttonIcon,
}: {
  href: string;
  description?: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center space-y-2">
      {description && <div className="text-muted-foreground">{description}</div>}

      <Link href={href}>
        <Button variant="gold" className="lift">
          {buttonIcon}
          {buttonText}
        </Button>
      </Link>
    </div>
  );
}
