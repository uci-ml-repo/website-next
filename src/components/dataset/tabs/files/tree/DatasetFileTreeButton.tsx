import { ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function DatasetFileTreeButton({
  children,
  className,
  onClick,
  chevron,
  chevronDown,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  chevron?: boolean;
  chevronDown?: boolean;
}) {
  return (
    <button
      className={cn(
        "flex min-w-full items-center space-x-1 rounded-lg py-1 pl-1 pr-4 hover:bg-accent",
        "[&>svg]:size-5 [&>svg]:shrink-0",
        className,
      )}
      onClick={onClick}
    >
      <div className="w-4">
        {chevron && (
          <ChevronRightIcon
            className={cn(
              "!size-4 transition-all",
              chevronDown ? "rotate-90" : "",
            )}
          />
        )}
      </div>
      {children}
    </button>
  );
}
