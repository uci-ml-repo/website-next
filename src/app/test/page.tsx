"use client";
import { useEffect, useState } from "react";
import type { Descendant } from "slate";

import Main from "@/components/layout/Main";
import RichTextEditor from "@/components/rich-text/RichTextEditor";

export default function TestPage() {
  const [value, setValue] = useState<Descendant[]>([
    { type: "paragraph", children: [{ text: "" }] },
  ]);

  useEffect(() => {
    console.log(JSON.stringify(value));
  }, [value]);

  return (
    <Main>
      <RichTextEditor
        placeholder="Type here..."
        spellCheck
        initialValue={value}
        onValueChange={setValue}
      />
    </Main>
  );
}
