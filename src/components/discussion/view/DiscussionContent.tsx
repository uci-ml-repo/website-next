"use client";

import { MDXViewer } from "@/components/editor/MDXViewer";
import { Expandable } from "@/components/ui/expandable";

export function DiscussionContent({ content }: { content: string }) {
  return (
    <Expandable truncationHeight={600}>
      <MDXViewer markdown={content} />
    </Expandable>
  );
}
