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
  InsertCodeBlock,
  InsertTable,
  InsertThematicBreak,
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

export const allPlugins = [
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  tablePlugin(),
  thematicBreakPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: "text" }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      python: "Python",
      text: "text",
    },
  }),
];

export type MDXEditorProps = Omit<React.ComponentProps<typeof MDXEditor>, "markdown"> & {
  markdown?: string;
  disabled?: boolean;
};

export default function MDXEditorInit({
  className,
  markdown = "",
  disabled,
  readOnly,
  ...props
}: MDXEditorProps) {
  const { theme } = useTheme();

  return (
    <MDXEditor
      className={cn({ "dark-theme": theme === "dark" }, className)}
      contentEditableClassName={cn(
        "prose min-w-full rounded-lg rounded-t-none bg-background font-sans dark:prose-invert",
        { "bg-muted": disabled },
        { "-mt-[4px] leading-[32px]": !markdown },
      )}
      markdown={markdown}
      readOnly={readOnly || disabled}
      {...props}
      plugins={[
        toolbarPlugin({
          toolbarContents: ToolbarContents,
        }),
        markdownShortcutPlugin(),
        diffSourcePlugin({ viewMode: "rich-text" }),
        ...allPlugins,
      ]}
    />
  );
}

function ToolbarContents() {
  const VerticalSeparator = () => <Separator orientation="vertical" className="h-5" />;

  return (
    <DiffSourceToggleWrapper options={["rich-text", "source"]}>
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

      <InsertTable />
      <InsertThematicBreak />

      <InsertCodeBlock />
    </DiffSourceToggleWrapper>
  );
}
