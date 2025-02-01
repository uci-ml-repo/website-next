"use client";

import MDXViewer from "@/components/editor/MDXViewer";
import ExpandableContent from "@/components/ui/expandable";

export default function DiscussionContent({ content }: { content: string }) {
  return (
    <ExpandableContent truncationHeight={600}>
      <MDXViewer markdown={content} />
    </ExpandableContent>
  );
}
