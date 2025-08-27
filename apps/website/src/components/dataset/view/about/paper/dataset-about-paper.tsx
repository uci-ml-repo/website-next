import Link from "next/link";

import type { DatasetFull } from "@/server/types/dataset/response";

export function DatasetAboutPaper({ dataset }: { dataset: DatasetFull }) {
  return (
    <div className="space-y-1">
      <h2 className="text-xl font-bold">Introductory Paper</h2>
      {dataset.paper ? (
        <div>
          <Link
            href={dataset.paper.url}
            target="_blank"
            className="text-link text-lg underline underline-offset-2"
          >
            {dataset.paper.title}
          </Link>
          <div className="text-muted-foregrounds">
            <div>{`${dataset.paper.authors.join(", ")}. ${dataset.paper.year}.`}</div>
            <div>{dataset.paper.venue}</div>
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground">&ndash;</div>
      )}
    </div>
  );
}
