import { UserIcon } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { DATASETS_QUERY } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";

export function DatasetSideData({ dataset }: { dataset: DatasetResponse }) {
  return (
    <div className="space-y-6">
      {/* Keywords */}
      <SideDatum title="Keywords" className="flex flex-wrap gap-1">
        {dataset.keywords.length > 0 &&
          dataset.keywords.map((keyword) => (
            <Link
              key={keyword}
              href={DATASETS_QUERY({ keywords: [keyword] })}
              className="text-uci-blue hover:underline"
            >
              <Badge variant="blue">{keyword}</Badge>
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

function SideDatum({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const blank = <div className="text-muted-foreground">&ndash;</div>;

  return (
    <div className="space-y-2">
      <div className="text-lg font-bold">{title}</div>
      <div className={className}>{children ? children : blank}</div>
    </div>
  );
}
