import type { HTMLAttributes } from "react";

import { cn } from "@/lib/util/cn";

type Props = HTMLAttributes<HTMLButtonElement> & { current: boolean; disabled?: boolean };

export function DatasetFilesBrowserInspectBreadcrumbsButton({
  className,
  current,
  disabled,
  ...props
}: Props) {
  return (
    <button
      aria-current={current}
      disabled={disabled}
      className={cn(
        "aria-[current=false]:text-muted-foreground h-8 rounded-sm px-2 text-sm font-medium text-nowrap",
        !disabled &&
          "hover:bg-accent-strong focus-visible:bg-accent-strong cursor-pointer -outline-offset-1 focus-visible:outline",
        className,
      )}
      {...props}
    />
  );
}
