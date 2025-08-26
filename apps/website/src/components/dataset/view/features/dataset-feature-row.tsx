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
}

export function DatasetFeatureRow({ feature, expanded, onToggle }: Props) {
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
        <TableCell className="flex justify-end">
          {expandable && (
            <ChevronRightIcon className="text-muted-foreground transition-all duration-150 group-aria-[expanded=true]:rotate-90" />
          )}
        </TableCell>
      </TableRow>

      {expandable && (
        <tr aria-hidden={!expanded}>
          <td className="p-0" colSpan={6}>
            <motion.div
              initial={false}
              animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
              style={{ overflow: "hidden" }}
              transition={{ duration: 0.15 }}
              className="bg-muted border-b"
            >
              <div className="p-3 whitespace-pre-wrap">{feature.description}</div>
            </motion.div>
          </td>
        </tr>
      )}
    </>
  );
}
