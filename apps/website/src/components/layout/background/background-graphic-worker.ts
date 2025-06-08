const TOTAL_SIZE = 600;
const MIN_NUM_NODES = 60;
const NUM_NODES_VARIANCE = 20;

const NODES_X_DEVIATION = 250;
const NODES_Y_DEVIATION = 80;

const BASE_SIZE = 3;
const MIN_SIZE = 0.25;
const SIZE_SCALE = 1.5;

const MAX_DISTANCE = 100;
const DISTANCE_EDGE_MULTIPLIER = 15;

export type GraphNode = {
  x: number;
  y: number;
  size: number;
  edgesTo: GraphNode[];
};

self.onmessage = () => {
  function randomHalfNormal(max: number, direction: number, standardDeviation: number) {
    const z0 = Math.sqrt(-2.0 * Math.log(Math.random())) * Math.cos(2.0 * Math.PI * Math.random());

    return direction * Math.abs(z0) * standardDeviation + max;
  }

  function quickDistance(node1: GraphNode, node2: GraphNode) {
    return Math.abs(node1.x - node2.x) + Math.abs(node1.y - node2.y);
  }

  const nodeCount = Math.floor(Math.random() * NUM_NODES_VARIANCE) + MIN_NUM_NODES;

  const nodes: GraphNode[] = Array.from({ length: nodeCount }, () => {
    const x = randomHalfNormal(TOTAL_SIZE, -1, NODES_X_DEVIATION);
    const y = randomHalfNormal(0, 1, NODES_Y_DEVIATION);

    return {
      x,
      y,
      size: Math.max(BASE_SIZE + (Math.random() * (x - y) * SIZE_SCALE) / 100, MIN_SIZE),
      edgesTo: [],
    };
  });

  nodes.sort((a, b) => b.size - a.size);

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dis = quickDistance(nodes[i], nodes[j]);
      if (dis < MAX_DISTANCE && Math.random() < DISTANCE_EDGE_MULTIPLIER / dis) {
        nodes[i].edgesTo.push(nodes[j]);
      }
    }
  }

  self.postMessage({ nodes });
};
