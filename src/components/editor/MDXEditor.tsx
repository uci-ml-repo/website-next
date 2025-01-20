"use client";

import dynamic from "next/dynamic";

const MDXEditorComp = dynamic(
  () => import("@/components/editor/MDXEditorInit"),
  {
    ssr: false,
  },
);

export interface EditorProps {
  markdown?: string;
  placeholder?: string;
  onChange?: (markdown: string) => void;
}

export default function MDXEditor(props: EditorProps) {
  return <MDXEditorComp {...props} />;
}
