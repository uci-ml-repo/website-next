"use client";

import type { GraphNode } from "@components/layout/background/background-graphic-worker";
import { cn } from "@lib/utils/cn";
import type { HTMLAttributes } from "react";
import { startTransition, useEffect, useState } from "react";

import styles from "./background-graphic.module.css";

const ANIMATION_DELAY = 0.01;

export function BackgroundGraphic({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [nodes, setNodes] = useState<GraphNode[]>([]);

  useEffect(() => {
    const worker = new Worker(new URL("./background-graphic-worker.ts", import.meta.url));

    worker.onmessage = (event: MessageEvent) => {
      startTransition(() => {
        setNodes(event.data.nodes);
      });
    };

    worker.postMessage(null);

    return () => worker.terminate();
  }, []);

  return (
    <div
      className={cn(
        "xs:size-[300px] pointer-events-none size-[275px] sm:size-[400px] xl:size-[600px]",
        className,
      )}
      aria-hidden={true}
      {...props}
    >
      <svg viewBox="0 0 600 600">
        {nodes.map((node, index) => (
          <g key={index}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              className={cn(styles.spring, "fill-gold/65")}
              style={{
                animationDelay: `${index * ANIMATION_DELAY}s`,
              }}
            />
            <g>
              {node.edgesTo.map((adjacentNode, edgeIndex) => (
                <line
                  key={edgeIndex}
                  x1={node.x}
                  y1={node.y}
                  x2={adjacentNode.x}
                  y2={adjacentNode.y}
                  strokeWidth="2"
                  className={cn(styles.draw, "stroke-gold/30")}
                  style={{
                    animationDelay: `${index * ANIMATION_DELAY}s`,
                  }}
                />
              ))}
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
