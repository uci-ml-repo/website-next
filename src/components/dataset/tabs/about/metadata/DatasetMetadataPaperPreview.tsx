import Link from "next/link";

import type { IntroductoryPaperSelect } from "@/db/types";

export function DatasetMetadataPaperPreview({
  paper,
}: {
  paper: IntroductoryPaperSelect;
}) {
  return (
    <div>
      <Link
        href={`https://www.semanticscholar.org/paper/${paper.semanticScholarId}`}
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
