"use client";

import "highlight.js/styles/github-dark.min.css";

import hljs from "highlight.js";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

import { PythonIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Copy from "@/components/ui/copy";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { DatasetResponse } from "@/lib/types";
import { cn } from "@/lib/utils";
import { getPythonSnippet } from "@/lib/utils/python";

interface DatasetPythonButtonProps {
  dataset: DatasetResponse;
}

const CodeBlock = ({ code, language }: { code: string; language?: string }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <div className={"dark relative overflow-hidden rounded-lg"}>
      <pre>
        <code className={cn("pr-12 text-sm", language)}>{code}</code>
      </pre>
      <Copy text={code} />
    </div>
  );
};

export default function DatasetPythonButton({
  dataset,
}: DatasetPythonButtonProps) {
  const pipInstallCommand = `pip install ucimlrepo`;

  const pythonCode = getPythonSnippet(dataset);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          pill
          variant={"secondary"}
          className={"lift w-full"}
          size={"lg"}
        >
          <PythonIcon />
          <div>Import</div>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Import Python</DialogTitle>
        </DialogHeader>
        <div className={"space-y-4 overflow-x-auto text-left"}>
          <div className={"space-y-2"}>
            <div>Install the ucimlrepo package</div>
            <CodeBlock code={pipInstallCommand} language={"language-bash"} />
          </div>
          <div className={"space-y-2"}>
            <div>Import the dataset into your code</div>
            <CodeBlock code={pythonCode} language={"language-python"} />
          </div>
          <Button variant={"secondary"} size={"sm"} asChild>
            <Link
              href={"https://github.com/uci-ml-repo/ucimlrepo"}
              target={"_blank"}
            >
              <div>View Docs</div>
              <ExternalLinkIcon />
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
