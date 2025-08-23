import type { ComponentProps } from "react";

import { useDatasetFilesBrowser } from "@/components/dataset/view/files/dataset-files-browser-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/util/cn";
import type { Entry } from "@/server/service/file/find";

type Props = ComponentProps<typeof Button> & {
  entry: Entry;
  level: number;
  active: boolean;
};

export function DatasetFilesBrowserTreeEntryButton({
  level,
  active,
  className,
  children,
  entry,
  onClick,
  ...props
}: Props) {
  const { setCurrentPath } = useDatasetFilesBrowser();

  return (
    <div className="relative">
      <Button
        variant="ghost"
        aria-current={active}
        aria-level={level}
        style={{ paddingLeft: level * 10 + 12 }}
        className={cn(
          "h-8 min-w-full cursor-default justify-start gap-1 rounded-sm font-normal",
          "aria-[current=true]:bg-accent-strong hover:bg-accent-strong transition-[border-radius]",
          active && "rounded-l-none",
          className,
        )}
        onClick={(e) => {
          onClick?.(e);
          setCurrentPath(entry.key);
        }}
        {...props}
      >
        {children}
      </Button>
      {active && (
        <div className="bg-link animate-in fade-in absolute top-0 -left-0.5 h-full w-[3px] rounded-full" />
      )}
    </div>
  );
}
