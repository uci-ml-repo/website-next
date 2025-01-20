"use client";

import dynamic from "next/dynamic";

import type { MDXEditorProps } from "@/components/editor/MDXEditorInit";

const MDXEditorComp = dynamic(
  () => import("@/components/editor/MDXEditorInit"),
  {
    ssr: false,
  },
);

export default function MDXEditor(props: MDXEditorProps) {
  return <MDXEditorComp {...props} />;
}
