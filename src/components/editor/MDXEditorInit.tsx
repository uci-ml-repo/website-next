"use client";

import "@mdxeditor/editor/style.css";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  codeBlockPlugin,
  codeMirrorPlugin,
  CodeToggle,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  headingsPlugin,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  StrikeThroughSupSubToggles,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import { useTheme } from "next-themes";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface MDXEditorProps {
  markdown?: string;
  placeholder?: string;
  diffMarkdown?: string;
  onChange?: (markdown: string) => void;
}

export default function MDXEditorInit({
  markdown,
  placeholder,
  diffMarkdown,
  onChange,
}: MDXEditorProps) {
  const { theme } = useTheme();

  return (
    <MDXEditor
      onChange={onChange}
      className={cn(theme === "dark" ? "dark-theme" : "")}
      contentEditableClassName="min-w-full bg-background prose dark:prose-invert"
      markdown={markdown ?? ""}
      placeholder={placeholder}
      plugins={[
        toolbarPlugin({
          toolbarContents: ToolbarContents,
        }),
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
        codeBlockPlugin({ defaultCodeBlockLanguage: "text" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            "C++": "C/C++",
            r: "R",
            python: "Python",
            js: "JavaScript",
            text: "text",
          },
          autoLoadLanguageSupport: true,
        }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: diffMarkdown }),
        markdownShortcutPlugin(),
      ]}
    />
  );
}

function ToolbarContents() {
  const VerticalSeparator = () => (
    <Separator orientation="vertical" className="h-5" />
  );

  return (
    <DiffSourceToggleWrapper>
      <UndoRedo />
      <VerticalSeparator />

      <BoldItalicUnderlineToggles />
      <CodeToggle />
      <VerticalSeparator />

      <StrikeThroughSupSubToggles />
      <VerticalSeparator />

      <ListsToggle />
      <VerticalSeparator />

      <BlockTypeSelect />
      <VerticalSeparator />

      <InsertImage />

      <InsertTable />
      <InsertThematicBreak />

      <InsertCodeBlock />
    </DiffSourceToggleWrapper>
  );
}
