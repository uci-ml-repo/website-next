import Link from "next/link";
import React from "react";

import type { PaperSelect } from "@/db/lib/types";

interface PaperSectionProps {
  paper: PaperSelect | null;
}

export function DatasetMetadataIntroductoryPaper({ paper }: PaperSectionProps) {
  return (
    <>
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
          <div>{`${paper.authors.join(", ")}. ${paper.year}.`}</div>
          <div>{paper.venue}</div>
        </div>
      ) : (
        <div className="text-muted-foreground">&ndash;</div>
      )}
    </>
  );
}
