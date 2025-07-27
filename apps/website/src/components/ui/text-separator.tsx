import { Separator } from "@components/ui/separator";
import { cn } from "@lib/util/cn";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  text: string;
}

export function TextSeparator({ text, className, ...props }: Props) {
  return (
    <div className={cn("flex items-center justify-center space-x-4", className)} {...props}>
      <Separator className="flex w-fit grow" />
      <span className="text-muted-foreground text-sm">{text}</span>
      <Separator className="flex w-fit grow" />
    </div>
  );
}
