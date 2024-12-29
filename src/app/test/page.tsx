"use client";

import Main from "@/components/layout/Main";
import RichTextEditor from "@/components/rich-text/RichTextEditor";

export default function TestPage() {
  return (
    <Main>
      <RichTextEditor
        placeholder="Type here..."
        spellCheck
        onChange={console.log}
        allowedFormats={[
          "bold",
          "italic",
          "underline",
          "block-quote",
          "bulleted-list",
          "numbered-list",
        ]}
      />
    </Main>
  );
}
