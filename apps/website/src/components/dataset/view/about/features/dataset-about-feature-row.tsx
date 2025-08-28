"use client";

import type { FeatureSelect } from "@packages/db/types";
import { ChevronRightIcon } from "lucide-react";
import { motion } from "motion/react";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/util/cn";
import { formatEnum } from "@/server/types/util/enum";

interface Props {
  feature: FeatureSelect;
  expanded: boolean;
  onToggle: () => void;
  showDescription?: boolean;
}

export function DatasetAboutFeatureRow({ feature, expanded, onToggle, showDescription }: Props) {
  const expandable = !!feature.description;

  return (
    <>
      <TableRow
        key={feature.name}
        aria-expanded={expanded}
        className={cn("group", expandable && "cursor-pointer")}
        role={expandable ? "button" : undefined}
        onClick={() => expandable && onToggle()}
        onKeyDown={(e) => {
          if (!expandable) return;
          if (e.key === "Enter" || e.key === " ") {
            onToggle();
            e.preventDefault();
          }
        }}
        tabIndex={expandable ? 0 : -1}
      >
        <TableCell>{feature.name}</TableCell>
        <TableCell>{formatEnum(feature.role)}</TableCell>
        <TableCell>{formatEnum(feature.type)}</TableCell>
        <TableCell>{feature.units || <span className="text-muted-foreground">-</span>}</TableCell>
        <TableCell>{feature.missingValues ? "Yes" : "No"}</TableCell>
        {showDescription && (
          <TableCell className={cn("flex justify-end", !expandable && "invisible")}>
            <ChevronRightIcon className="text-muted-foreground size-5 shrink-0 transition-all duration-150 group-aria-[expanded=true]:rotate-90" />
          </TableCell>
        )}
      </TableRow>

      {expandable && (
        <tr aria-hidden={!expanded} className={cn(expanded && "border-b")}>
          <td colSpan={6}>
            <motion.div
              initial={false}
              animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
              style={{ overflow: "hidden" }}
              transition={{ duration: 0.1 }}
              className="bg-muted/60"
            >
              <div className="p-2 text-sm whitespace-pre-wrap">{feature.description}</div>
            </motion.div>
          </td>
        </tr>
      )}
    </>
  );
}
