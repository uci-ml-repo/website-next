"use client";

import "highlight.js/styles/github-dark.css";

import hljs from "highlight.js";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PythonIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Dataset } from "@/lib/types";

interface DatasetPythonProps {
  dataset: Dataset;
}

const CodeBlock = ({
  code,
  copy,
  language,
}: {
  code: string;
  copy?: boolean;
  language?: string;
}) => {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    });
  };

  const triggerRef = useRef(null);

  return (
    <div className={"dark relative overflow-hidden rounded-lg"}>
      <pre>
        <code className={language}>{code}</code>
      </pre>
      {copy && (
        <TooltipProvider>
          <Tooltip delayDuration={0} disableHoverableContent>
            <TooltipTrigger
              asChild
              onClick={(event) => event.preventDefault()}
              ref={triggerRef}
            >
              <Button
                variant={"outline"}
                size={"icon"}
                className={"absolute right-2 top-2.5 text-primary"}
                onClick={copyCode}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </Button>
            </TooltipTrigger>
            <TooltipContent
              onPointerDownOutside={(event) => {
                if (event.target === triggerRef.current) event.preventDefault();
              }}
            >
              <p>{copied ? "Copied" : "Copy"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

export default function DatasetPython({ dataset }: DatasetPythonProps) {
  const pipInstallCommand = `pip install ucimlrepo`;

  const pythonCode = `from ucimlrepo import fetch_ucirepo 
  
# fetch dataset 
iris = fetch_ucirepo(id=${dataset.id}) 
  
# data (as pandas dataframes) 
X = iris.data.features 
y = iris.data.targets 
  
# metadata 
print(iris.metadata) 
  
# variable information 
print(iris.variables) `;

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
          <div>Import Python</div>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Python</DialogTitle>
        </DialogHeader>
        <div className={"space-y-4 text-left"}>
          <div className={"text-lg"}>Install the ucimlrepo package</div>
          <CodeBlock code={pipInstallCommand} language={"language-bash"} copy />
          <div className={"text-lg"}>Import the dataset into your code</div>
          <CodeBlock code={pythonCode} language={"language-python"} copy />
        </div>
      </DialogContent>
    </Dialog>
  );
}
