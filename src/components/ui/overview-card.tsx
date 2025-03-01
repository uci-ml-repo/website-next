import { ArrowRightIcon, EllipsisIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

interface OverviewCardProps {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  href: string;
}

export function OverviewCard({
  title,
  icon,
  children,
  href,
}: OverviewCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <Link href={href}>
        <CardTitle className="group flex items-center justify-between p-3 hover:bg-accent">
          <div className="flex items-center space-x-2">
            {icon}
            <span className="group-hover:underline">{title}</span>
          </div>
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </CardTitle>
      </Link>
      {children && (
        <>
          <hr />
          <CardContent className="flex flex-1 flex-col bg-muted p-2">
            {children}
          </CardContent>
        </>
      )}
    </Card>
  );
}

export function OverviewCardViewMore({
  href,
  text,
}: {
  href: string;
  text: string;
}) {
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
      {description && (
        <div className="text-muted-foreground">{description}</div>
      )}

      <Link href={href}>
        <Button variant="gold" className="lift">
          {buttonIcon}
          {buttonText}
        </Button>
      </Link>
    </div>
  );
}
