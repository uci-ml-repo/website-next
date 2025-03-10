import hljs from "highlight.js";
import { useEffect } from "react";

import { Copy } from "@/components/ui/copy";
import { cn } from "@/lib/utils";

export const CodeBlock = ({
  code,
  language,
}: {
  code: string;
  language?: string;
}) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <div className={cn("dark relative overflow-hidden rounded-lg")}>
      <pre>
        <code className={cn("pr-12 text-sm", language)}>{code}</code>
      </pre>
      <Copy copyText={code} />
    </div>
  );
};
