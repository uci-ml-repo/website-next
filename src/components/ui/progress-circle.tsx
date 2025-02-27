import React from "react";

import { cn } from "@/lib/utils";

interface ProgressCircleProps {
  progress: number;
  className?: string;
}

export function ProgressCircle({ progress, className }: ProgressCircleProps) {
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div className={cn("relative size-8", className)}>
      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 36 36"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="18"
          cy="18"
          r={radius}
          strokeWidth={radius / 2}
          className="fill-none stroke-muted"
        />
        <circle
          cx="18"
          cy="18"
          r={radius}
          fill="none"
          className="stroke-current text-uci-blue"
          strokeWidth={radius / 2}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 300ms ease-in-out" }}
        />
      </svg>
    </div>
  );
}
