"use client";

import type { FeatureSelect } from "@packages/db/types";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { DatasetAboutFeatureRow } from "@/components/dataset/view/about/features/dataset-about-feature-row";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DatasetFull } from "@/server/types/dataset/response";

export function DatasetAboutFeatures({ dataset }: { dataset: DatasetFull }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const describable = useMemo(
    () => dataset.featureObjects.filter((f) => !!f.description),
    [dataset.featureObjects],
  );

  const anyExpanded = expanded.size > 0;

  const toggleOne = (name: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(describable.map((f) => f.name)));
  const collapseAll = () => setExpanded(new Set());

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="space-x-2 text-xl font-bold">
          <span>Features</span>
          <span className="text-muted-foreground font-normal">({dataset.features.length})</span>
        </div>

        <div className="flex items-center gap-2">
          <CopyButton copyText={featuresToCsv(dataset.featureObjects)} variant="outline" size="sm">
            Copy CSV
          </CopyButton>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Units</TableHead>
              <TableHead>Missing Values</TableHead>
              <TableHead className="flex items-center justify-end gap-x-1">
                <span>Description</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-accent-strong"
                  onClick={anyExpanded ? collapseAll : expandAll}
                  disabled={describable.length === 0}
                  aria-label={anyExpanded ? "Collapse all descriptions" : "Expand all descriptions"}
                >
                  {anyExpanded ? <ChevronsDownUpIcon /> : <ChevronsUpDownIcon />}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {dataset.featureObjects.map((feature) => (
              <DatasetAboutFeatureRow
                key={feature.name}
                feature={feature}
                expanded={expanded.has(feature.name)}
                onToggle={() => toggleOne(feature.name)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function featuresToCsv(features: FeatureSelect[]) {
  const headers = ["Name", "Role", "Type", "Units", "Description", "Missing Values"];
  const rows = features.map((feature) => [
    feature.name,
    feature.role,
    feature.type,
    feature.units || "",
    feature.description || "",
    feature.missingValues ? "Yes" : "No",
  ]);
  return [headers, ...rows].map((e) => e.join(",")).join("\n");
}
