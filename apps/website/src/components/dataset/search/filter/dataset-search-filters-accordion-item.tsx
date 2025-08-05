import { CheckIcon, XIcon } from "lucide-react";
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
}

export function DatasetSearchFiltersAccordionItem({
  name,
  badge,
  children,
  tooltip,
  tooltipOpen,
  clearFilter,
  ...props
}: Props) {
  return (
    <Tooltip open={tooltipOpen}>
      <AccordionItem {...props}>
        <div className="relative">
          <AccordionTrigger
            className={cn(
              "px-4 text-base",
              "hover:[&>svg]:scale-150 focus-visible:[&>svg]:scale-150 has-[div[role=button]:hover]:[&>svg]:scale-100",
            )}
          >
            <div className="flex w-full items-center justify-between">
              <div>{name}</div>
              {badge && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge
                      variant="blue"
                      className={cn(
                        "group/clear flex size-5.5 items-center justify-center p-0 transition-none",
                        "hover:bg-destructive focus-visible:bg-destructive hover:border-destructive focus-visible:border-destructive",
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
                      {badge === true ? (
                        <>
                          <CheckIcon className="size-3.5 group-hover/clear:hidden group-focus-visible/clear:hidden" />
                          <XIcon className="hidden size-3.5 group-hover/clear:block group-focus-visible/clear:block" />
                        </>
                      ) : (
                        badge
                      )}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>Clear</TooltipContent>
                </Tooltip>
              )}
            </div>
          </AccordionTrigger>
          <TooltipTrigger className="invisible absolute top-1/2 right-0" />
        </div>

        <AccordionContent className="bg-accent p-4 select-none last:rounded-b-2xl">
          {children}
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
