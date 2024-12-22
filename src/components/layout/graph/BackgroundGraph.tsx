"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";

import type {
  GraphEdge,
  GraphNode,
} from "@/components/layout/graph/backgroundGraphWorker";

const BackgroundGraph = () => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);

  const TRANSITION_DELAY = 0.005;

  useEffect(() => {
    const worker = new Worker(
      new URL("./backgroundGraphWorker.ts", import.meta.url),
    );

    worker.onmessage = (event: MessageEvent) => {
      const { nodes, edges } = event.data;
      setNodes(nodes);
      setEdges(edges);
    };

    worker.postMessage(null);

    return () => worker.terminate();
  }, []);

  return (
    <div
      className={`absolute right-0 top-0 -z-50 size-[250px] xs:size-[300px] sm:size-[400px] xl:size-[500px]`}
    >
      <svg viewBox={`0 0 500 500`}>
        {edges.map((edge, index) => {
          const sourceNode = nodes[edge.source];
          const targetNode = nodes[edge.target];
          return (
            <motion.line
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2 + index * TRANSITION_DELAY }}
              key={index}
              x1={sourceNode.x}
              y1={sourceNode.y}
              x2={targetNode.x}
              y2={targetNode.y}
              strokeWidth="2"
              className={"stroke-uci-gold/30"}
            />
          );
        })}
        {nodes.map((node, index) => (
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * TRANSITION_DELAY }}
            key={index}
            cx={node.x}
            cy={node.y}
            r={node.size}
            className={"fill-uci-gold/60"}
          />
        ))}
      </svg>
    </div>
  );
};

export default BackgroundGraph;
