import Link from "next/link";

import type { PaperSelect } from "@/db/lib/types";

export function DatasetMetadataPaperPreview({ paper }: { paper: PaperSelect }) {
  return (
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
  );
}
