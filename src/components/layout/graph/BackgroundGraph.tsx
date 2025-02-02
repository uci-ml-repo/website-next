"use client";

import { startTransition, useEffect, useState } from "react";

import type { GraphNode } from "@/components/layout/graph/backgroundGraphWorker";
import { cn } from "@/lib/utils";

import styles from "./BackgroundGraph.module.css";

const BackgroundGraph = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);

  const ANIMATION_DELAY = 0.01;

  useEffect(() => {
    const worker = new Worker(
      new URL("./backgroundGraphWorker.ts", import.meta.url),
    );

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
        `absolute right-0 top-0 -z-50`,
        `size-[275px] xs:size-[300px] sm:size-[400px] xl:size-[600px]`,
      )}
      aria-hidden={true}
    >
      <svg viewBox="0 0 600 600">
        {nodes.map((node, index) => (
          <g key={index}>
            <circle
              cx={node.x}
              cy={node.y}
              r={node.size}
              className={cn(styles.spring, "fill-uci-gold/65")}
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
                  className={cn(styles.draw, "stroke-uci-gold/30")}
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
};

export default BackgroundGraph;
