import React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  progress: number;
  className?: string;
}

export function ProgressCircle({ progress, className }: ProgressCircleProps) {
  const radius = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={cn("relative size-10", className)}>
          <svg
            className="h-full w-full -rotate-90"
            viewBox="0 0 36 36"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="18"
              cy="18"
              r={radius}
              className="fill-none stroke-current text-muted"
            />
            <circle
              cx="18"
              cy="18"
              r={radius}
              fill="none"
              className="stroke-current text-uci-blue"
              strokeWidth={radius / 4}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 300ms ease-in-out" }}
            />
          </svg>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div>{progress * 100}%</div>
      </TooltipContent>
    </Tooltip>
  );
}
