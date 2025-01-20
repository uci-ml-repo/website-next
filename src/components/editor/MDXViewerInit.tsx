"use client";

import "@mdxeditor/editor/style.css";

import {
  codeBlockPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

interface EditorProps {
  markdown?: string;
}

export default function MDXViewerInit({ markdown }: EditorProps) {
  const { theme } = useTheme();

  return (
    <MDXEditor
      readOnly
      className={cn(theme === "dark" ? "dark-theme" : "")}
      contentEditableClassName="min-w-full bg-background prose dark:prose-invert"
      markdown={markdown ?? ""}
      plugins={[
        listsPlugin(),
        quotePlugin(),
        headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageUploadHandler: async () =>
            Promise.resolve("https://picsum.photos/200/300"),
        }),
        tablePlugin(),
        thematicBreakPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        markdownShortcutPlugin(),
      ]}
    />
  );
}
