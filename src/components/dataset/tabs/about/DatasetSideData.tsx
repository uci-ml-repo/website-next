import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import type { DatasetResponse } from "@/lib/types";

export default function DatasetSideData({
  dataset,
}: {
  dataset: DatasetResponse;
}) {
  const blank = <div className="text-muted-foreground">&ndash;</div>;

  return (
    <div className="min-w-[275px] space-y-4">
      {/* Keywords */}
      <div className="space-y-2">
        <div className="text-lg font-bold">Keywords</div>
        {dataset.datasetKeywords.length > 0
          ? dataset.datasetKeywords.map((datasetKeyword) => (
              <Badge variant="outline" key={datasetKeyword.keyword.id}>
                {datasetKeyword.keyword.keyword}
              </Badge>
            ))
          : blank}
      </div>

      {/* Authors */}
      <div className="space-y-2">
        <div className="text-lg font-bold">Authors</div>
        {dataset.authors.length > 0 ? (
          <>
            {dataset.authors.map((author) => (
              <div key={author.id}>
                {author.firstName} {author.lastName}
              </div>
            ))}
          </>
        ) : (
          blank
        )}
      </div>

      {/* DOI */}
      <div className="space-y-2">
        <div className="text-lg font-bold">DOI</div>
        {dataset.doi ? (
          <Link
            href={`https://doi.org/${dataset.doi}`}
            target="_blank"
            className="text-muted-foreground underline underline-offset-2"
          >
            {dataset.doi}
          </Link>
        ) : (
          blank
        )}
      </div>

      {/* License */}
      <div className="space-y-2">
        <div className="text-lg font-bold">License</div>
        <Link
          href="https://creativecommons.org/licenses/by/4.0/"
          target="_blank"
          className="text-muted-foreground underline underline-offset-2"
        >
          CC BY 4.0
        </Link>
      </div>
    </div>
  );
}
