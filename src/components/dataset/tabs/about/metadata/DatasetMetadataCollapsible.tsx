import { ChevronDownIcon } from "lucide-react";
import { motion } from "motion/react";

import { Collapsible, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export function DatasetMetadataCollapsible({
  title,
  children,
  isOpen,
  onOpenChange,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onOpenChange: () => void;
}) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <div className="group flex cursor-pointer items-center justify-between space-x-6 px-2 py-6">
          <div className="text-xl font-semibold">{title}</div>
          <div
            className={cn(
              "transition-transform group-hover:scale-125",
              isOpen ? "-rotate-180" : "",
            )}
          >
            <ChevronDownIcon />
          </div>
        </div>
      </CollapsibleTrigger>

      <motion.div
        initial={{ height: 0, paddingBottom: 0 }}
        animate={isOpen ? { height: "fit-content", paddingBottom: 24 } : {}}
        className="overflow-y-hidden px-2"
        transition={{ duration: 0.15, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </Collapsible>
  );
}
