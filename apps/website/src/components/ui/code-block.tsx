import "highlight.js/styles/github-dark.min.css";

import hljs from "highlight.js";
import { useEffect } from "react";

import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/util/cn";

export const CodeBlock = ({ code, language }: { code: string; language?: string }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <div className="relative overflow-hidden rounded-lg">
      <pre>
        <code className={cn("text-sm", language)}>{code}</code>
      </pre>
      <CopyButton copyText={code} className="dark absolute top-1.5 right-1.5 bg-[#0d1117]" />
    </div>
  );
};
