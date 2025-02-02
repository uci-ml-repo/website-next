"use client";

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

interface DatasetPythonImportButtonProps {
  dataset: DatasetResponse;
}

function getPythonSnippet({ id, slug }: DatasetResponse) {
  let variableName = slug.replace(/[^a-zA-Z0-9]/g, "_");

  return `from ucimlrepo import fetch_ucirepo 
  
# fetch dataset 
${variableName} = fetch_ucirepo(id=${id}) 
  
# data (as pandas dataframes) 
x = ${variableName}.data.features 
y = ${variableName}.data.targets 
  
# metadata 
print(${variableName}.metadata) 
  
# variable information 
print(${variableName}.variables) `;
}

const CodeBlock = ({ code, language }: { code: string; language?: string }) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <div className={cn("dark relative overflow-hidden rounded-lg")}>
      <pre>
        <code className={cn("pr-12 text-sm", language)}>{code}</code>
      </pre>
      <Copy text={code} />
    </div>
  );
};

export default function DatasetPythonImportButton({
  dataset,
}: DatasetPythonImportButtonProps) {
  const pipInstallCommand = `pip install ucimlrepo`;

  const pythonCode = getPythonSnippet(dataset);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="lift w-full"
          size="lg"
          aria-label={`Import ${dataset.title} in Python`}
        >
          <PythonIcon />
          <div>Import</div>
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Import Python</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-x-auto text-left">
          <div className="space-y-2">
            <div>Install the ucimlrepo package</div>
            <CodeBlock code={pipInstallCommand} language="language-bash" />
          </div>
          <div className="space-y-2">
            <div>Import the dataset into your code</div>
            <CodeBlock code={pythonCode} language="language-python" />
          </div>
          <Button variant="secondary" size="sm" asChild>
            <Link
              href="https://github.com/uci-ml-repo/ucimlrepo"
              target="_blank"
              className="underline-offset-1 hover:underline"
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
