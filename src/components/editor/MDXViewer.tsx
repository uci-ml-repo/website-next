"use client";

import dynamic from "next/dynamic";

const MDXViewerComp = dynamic(
  () => import("@/components/editor/MDXViewerInit"),
  {
    ssr: false,
  },
);

export interface MDXViewerProps {
  markdown?: string;
}

export default function MDXViewer(props: MDXViewerProps) {
  return <MDXViewerComp {...props} />;
}
