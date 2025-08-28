import { UserIcon } from "lucide-react";
import Link from "next/link";

import { DatasetAboutSideDatum } from "@/components/dataset/view/about/side/dataset-about-side-datum";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/lib/routes";
import type { DatasetFull } from "@/server/types/dataset/response";

export function DatasetAboutSideData({ dataset }: { dataset: DatasetFull }) {
  return (
    <div className="space-y-6">
      <DatasetAboutSideDatum title="Keywords">
        {dataset.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {dataset.keywords.map((keyword) => (
              <Link key={keyword} href={ROUTES.SEARCH({ keywords: [keyword] })}>
                <Badge variant="blue-ghost" className="hover:underline">
                  {keyword}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </DatasetAboutSideDatum>

      <DatasetAboutSideDatum title="Authors">
        {dataset.authors.length > 0 && (
          <div className="space-y-1">
            {dataset.authors.map((author) => (
              <div key={author.id}>
                <div className="flex items-center space-x-1">
                  <UserIcon className="fill-foreground size-5 shrink-0" />
                  <span className="truncate">
                    {author.firstName} {author.lastName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </DatasetAboutSideDatum>

      <DatasetAboutSideDatum title="Year Created">
        {dataset.yearCreated && <div>{dataset.yearCreated}</div>}
      </DatasetAboutSideDatum>

      <DatasetAboutSideDatum title="DOI">
        {dataset.doi && (
          <Link
            href={`https://doi.org/${dataset.doi}`}
            target="_blank"
            className="text-muted-foreground underline underline-offset-2"
          >
            {dataset.doi}
          </Link>
        )}
      </DatasetAboutSideDatum>

      <DatasetAboutSideDatum title="License">
        <Link
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          className="text-muted-foreground underline underline-offset-2"
        >
          CC BY 4.0
        </Link>
      </DatasetAboutSideDatum>
    </div>
  );
}
