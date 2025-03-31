import { UserIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";
import { SideDatum } from "@/components/dataset/tabs/about/sections/side/DatasetSideDatum";
import { DatasetSideStatus } from "@/components/dataset/tabs/about/sections/side/status/DatasetSideStatus";
import { Badge } from "@/components/ui/badge";
import { DATASETS_QUERY } from "@/lib/routes";

export function DatasetSideData() {
  const { dataset, editable } = useDataset();

  return (
    <div className="space-y-6">
      {editable && <DatasetSideStatus status={dataset.status} />}

      {/* Keywords */}
      <SideDatum title="Keywords" className="flex flex-wrap gap-1">
        {dataset.keywords.length > 0 &&
          dataset.keywords.map((keyword) => (
            <Link key={keyword} href={DATASETS_QUERY({ keywords: [keyword] })}>
              <Badge variant="blue" className="lift text-uci-blue hover:underline">
                {keyword}
              </Badge>
            </Link>
          ))}
      </SideDatum>

      {/* Authors */}
      <SideDatum title="Authors" className="space-y-1">
        {dataset.authors.length > 0 &&
          dataset.authors.map((author) => (
            <div key={author.id}>
              <div className="flex items-center space-x-1">
                <UserIcon className="size-5 shrink-0 fill-foreground" />
                <span className="truncate">
                  {author.firstName} {author.lastName}
                </span>
              </div>
            </div>
          ))}
      </SideDatum>

      {/* Year Created */}
      <SideDatum title="Year Created">{dataset.yearCreated}</SideDatum>

      {/* Donated On */}
      <SideDatum title="Donated On">
        {dataset.donatedAt.toLocaleString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}
      </SideDatum>

      {/* DOI */}
      <SideDatum title="DOI">
        {dataset.doi && (
          <Link
            href={`https://doi.org/${dataset.doi}`}
            target="_blank"
            className="text-muted-foreground underline underline-offset-2"
          >
            {dataset.doi}
          </Link>
        )}
      </SideDatum>

      {/* License */}
      {!dataset.externalLink && (
        <SideDatum title="License">
          <Link
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            className="text-muted-foreground underline underline-offset-2"
          >
            CC BY 4.0
          </Link>
        </SideDatum>
      )}
    </div>
  );
}
