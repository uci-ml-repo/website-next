"use client";

import "@mdxeditor/editor/style.css";

import { MDXEditor } from "@mdxeditor/editor";
import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";

import { allPlugins } from "@/components/editor/MDXEditorInit";
import { cn } from "@/lib/utils";

interface EditorProps {
  markdown?: string;
}

export default function MDXViewerInit({ markdown }: EditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current) {
      const links = editorRef.current.querySelectorAll("a");
      links.forEach((link) => {
        link.setAttribute("target", "_blank");
      });
    }
  }, []);

  return (
    <div ref={editorRef}>
      <MDXEditor
        readOnly
        className={cn(
          { "dark-theme": theme === "dark" },
          "hide-codemirror-toolbar [&_div]:p-0",
        )}
        contentEditableClassName="prose min-w-full bg-background dark:prose-invert"
        markdown={markdown ?? ""}
        plugins={allPlugins}
      />
    </div>
  );
}
