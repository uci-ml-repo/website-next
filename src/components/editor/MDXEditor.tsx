"use client";

import dynamic from "next/dynamic";

import type { MDXEditorProps } from "@/components/editor/MDXEditorInit";
import { Spinner } from "@/components/ui/spinner";

const MDXEditorComp = dynamic(
  () => import("@/components/editor/MDXEditorInit"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-12 items-center justify-center">
        <Spinner />
      </div>
    ),
  },
);

export function MDXEditor(props: MDXEditorProps) {
  return (
    <div className="rounded-lg border">
      <MDXEditorComp {...props} />
    </div>
  );
}
