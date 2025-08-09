import { CheckIcon, Loader2Icon, XIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/util/cn";

interface Props extends ComponentProps<typeof AccordionItem> {
  name: string;
  badge?: boolean | number | string | null;
  tooltip?: string;
  tooltipOpen?: boolean;
  clearFilter?: () => void;
  isLoading?: boolean;
}

export function DatasetFilterItem({
  name,
  badge,
  children,
  tooltip,
  tooltipOpen,
  clearFilter,
  className,
  isLoading,
  ...props
}: Props) {
  return (
    <Tooltip open={tooltipOpen}>
      <AccordionItem
        className={cn("last:[&>[data-slot=accordion-content]]:rounded-b-2xl", className)}
        {...props}
      >
        <div className="relative">
          <AccordionTrigger
            className={cn(
              "px-4 text-base",
              "hover:[&>svg]:scale-[1.35] focus-visible:[&>svg]:scale-[1.35]",
              "has-[div[role=button]:hover]:[&>svg]:scale-100",
            )}
          >
            <div className="flex w-full items-center justify-between">
              <div>{name}</div>
              {!!badge && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="blue"
                      className={cn(
                        "group/clear flex h-5.5 min-w-5.5 items-center justify-center px-0.5 py-0 transition-none",
                        "hover:bg-secondary hover:border-secondary hover:text-secondary-foreground",
                        "focus-visible:border-secondary focus-visible:bg-secondary focus-visible:text-secondary-foreground",
                      )}
                      onClick={(event) => {
                        if (clearFilter) clearFilter();
                        event.stopPropagation();
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === " ") {
                          if (clearFilter) clearFilter();
                          event.stopPropagation();
                        }
                      }}
                      aria-label={`Clear ${name} filter`}
                      tabIndex={0}
                      role="button"
                    >
                      <div className="text-xs font-normal group-hover/clear:hidden group-focus-visible/clear:hidden">
                        {badge === true ? <CheckIcon className="size-3.5" /> : badge}
                      </div>
                      <XIcon className="hidden size-3.5 group-hover/clear:block group-focus-visible/clear:block" />
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Clear</TooltipContent>
                </Tooltip>
              )}
            </div>
          </AccordionTrigger>
          <TooltipTrigger className="invisible absolute top-1/2 right-0" asChild>
            <div />
          </TooltipTrigger>
        </div>

        <AccordionContent className="bg-muted [&_[data-slot=checkbox][data-state=unchecked]]:bg-card p-4 select-none has-[input]:px-2">
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : (
            children
          )}
        </AccordionContent>
      </AccordionItem>
      <TooltipContent
        side="right"
        className="bg-gold [&_svg]:bg-gold [&_svg]:fill-gold text-gold-foreground text-base shadow-md"
      >
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}
