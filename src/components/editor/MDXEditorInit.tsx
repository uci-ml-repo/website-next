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

export type MDXEditorProps = Omit<
  React.ComponentProps<typeof MDXEditor>,
  "markdown"
> & {
  diffMarkdown?: string;
  markdown?: string;
};

export default function MDXEditorInit({
  diffMarkdown,
  ...props
}: MDXEditorProps) {
  const { theme } = useTheme();

  return (
    <MDXEditor
      className={cn(
        theme === "dark" ? "dark-theme" : "",
        "overflow-hidden rounded-lg border",
        props.className,
      )}
      contentEditableClassName="min-w-full bg-background prose dark:prose-invert"
      markdown={props.markdown ?? ""}
      {...props}
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
