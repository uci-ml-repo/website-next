import type { ComponentProps } from "react";

import { cn } from "@/lib/util/cn";

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "border-input placeholder:text-muted-foreground dark:bg-input/30 flex min-h-28 w-full rounded-xl border bg-transparent px-3 py-2 text-base shadow-xs outline-none md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-[3px]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
