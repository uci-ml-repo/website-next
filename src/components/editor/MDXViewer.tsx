"use client";

import dynamic from "next/dynamic";

import { Spinner } from "@/components/ui/spinner";

const MDXViewerComp = dynamic(() => import("@/components/editor/MDXViewerInit"), {
  ssr: false,
  loading: () => (
    <div className="flex h-12 items-center justify-center">
      <Spinner />
    </div>
  ),
});

export interface MDXViewerProps {
  markdown?: string;
}

export function MDXViewer(props: MDXViewerProps) {
  return <MDXViewerComp {...props} />;
}
