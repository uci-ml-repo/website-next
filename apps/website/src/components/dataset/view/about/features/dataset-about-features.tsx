"use client";

import type { FeatureSelect } from "@packages/db/types";
import { ChevronsDownUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { DatasetAboutFeatureRow } from "@/components/dataset/view/about/features/dataset-about-feature-row";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { ShowMore } from "@/components/ui/show-more";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DatasetFull } from "@/server/types/dataset/response";

export function DatasetAboutFeatures({ dataset }: { dataset: DatasetFull }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const hasDescription = useMemo(
    () => dataset.features.filter((f) => !!f.description),
    [dataset.features],
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

  const expandAll = () => setExpanded(new Set(hasDescription.map((f) => f.name)));
  const collapseAll = () => setExpanded(new Set());

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold">Features</h2>

        {!!dataset.features.length && (
          <div className="flex items-center gap-2">
            <CopyButton copyText={featuresToCsv(dataset.features)} variant="outline" size="sm">
              Copy CSV
            </CopyButton>
          </div>
        )}
      </div>

      {!!dataset.features.length ? (
        <ShowMore className="rounded-lg border">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Units</TableHead>
                <TableHead>Missing Values</TableHead>
                {!!hasDescription.length && (
                  <TableHead className="flex items-center justify-end gap-x-1">
                    <span>Description</span>
                    <Button
                      size="icon-sm"
                      variant="ghost"
                      className="hover:bg-accent-strong"
                      onClick={anyExpanded ? collapseAll : expandAll}
                      disabled={hasDescription.length === 0}
                      aria-label={
                        anyExpanded ? "Collapse all descriptions" : "Expand all descriptions"
                      }
                    >
                      {anyExpanded ? <ChevronsDownUpIcon /> : <ChevronsUpDownIcon />}
                    </Button>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>

            <TableBody>
              {dataset.features.map((feature) => (
                <DatasetAboutFeatureRow
                  key={feature.name}
                  feature={feature}
                  expanded={expanded.has(feature.name)}
                  onToggle={() => toggleOne(feature.name)}
                  showDescription={!!hasDescription.length}
                />
              ))}
            </TableBody>
          </Table>
        </ShowMore>
      ) : (
        <div className="text-muted-foreground/60">&ndash;</div>
      )}
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
