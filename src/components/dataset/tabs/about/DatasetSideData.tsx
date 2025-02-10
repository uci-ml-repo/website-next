import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { DATASETS_QUERY } from "@/lib/routes";
import type { DatasetResponse } from "@/lib/types";

export function DatasetSideData({ dataset }: { dataset: DatasetResponse }) {
  console.log(dataset.authors);

  return (
    <div className="w-80 overflow-hidden space-y-6">
      {/* Donated On */}
      <SideDatum title="Donated On">
        <div>
          {dataset.donatedAt.toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </SideDatum>

      {/* Keywords */}
      <SideDatum title="Keywords ">
        <div className="flex flex-wrap gap-1">
          {dataset.keywords.length > 0 &&
            dataset.keywords.map((keyword) => (
              <Link
                key={keyword}
                href={DATASETS_QUERY({ keywords: [keyword] })}
              >
                <Badge variant="blue">{keyword}</Badge>
              </Link>
            ))}
        </div>
      </SideDatum>

      <SideDatum title="Authors">
        {dataset.authors.length > 0 &&
          dataset.authors.map((author) => (
            <div key={author.id}>
              {author.firstName} {author.lastName}
            </div>
          ))}
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
      <SideDatum title="License">
        <Link
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          className="text-muted-foreground underline underline-offset-2"
        >
          CC BY 4.0
        </Link>
      </SideDatum>
    </div>
  );
}

function SideDatum({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  const blank = <div className="text-muted-foreground">&ndash;</div>;

  return (
    <div className="space-y-2">
      <div className="text-lg font-bold">{title}</div>
      {children ? children : blank}
    </div>
  );
}
