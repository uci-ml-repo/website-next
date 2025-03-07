import Link from "next/link";
import React from "react";

import { useDataset } from "@/components/dataset/context/DatasetContext";

export function DatasetIntroductoryPaper() {
  const { dataset } = useDataset();

  const paper = dataset.introductoryPaper;

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Introductory Paper</h2>{" "}
      {paper ? (
        <div>
          <Link
            // href={`https://www.semanticscholar.org/paper/${paper.semanticScholarId}`}
            href={paper.url}
            target="_blank"
            className="text-lg text-link underline underline-offset-2"
          >
            {paper.title}
          </Link>
          <div className="text-muted-foregrounds">
            <div>{`${paper.authors.join(", ")}. ${paper.year}.`}</div>
            <div>{paper.venue}</div>
          </div>
        </div>
      ) : (
        <div className="text-muted-foreground">No information</div>
      )}
    </div>
  );
}
