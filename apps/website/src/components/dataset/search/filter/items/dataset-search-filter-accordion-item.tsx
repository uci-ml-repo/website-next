import type { ComponentProps } from "react";

import { AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface Props extends ComponentProps<typeof AccordionItem> {
  name: string;
  tooltip?: string;
  tooltipOpen?: boolean;
}

export function DatasetSearchFilterAccordionItem({
  name,
  children,
  tooltip,
  tooltipOpen,
  ...props
}: Props) {
  return (
    <Tooltip open={tooltipOpen}>
      <AccordionItem {...props}>
        <div className="relative">
          <AccordionTrigger className="px-4 text-base hover:[&>svg]:scale-150">
            {name}
          </AccordionTrigger>
          <TooltipTrigger className="absolute top-1/2 right-0" />
        </div>

        <AccordionContent className="bg-accent p-4">{children}</AccordionContent>
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
