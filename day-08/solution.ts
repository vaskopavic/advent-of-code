// --- Day 8: Haunted Wasteland ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

interface GraphNode {
  name: string;
  left: string;
  right: string;
}

interface GraphMap {
  instruction: string;
  graph: { [k: string]: GraphNode };
}

const parseMap = (lines: string[]): GraphMap => {
  const instruction = lines.shift() || "";
  let nodes: { [k: string]: GraphNode } = {};
  lines.forEach((line) => {
    const [name, rest] = line.split(" = ");
    const [left, right] = [...rest.matchAll(/\w+/gi)].map((m) => m[0]);
    nodes[name] = { name, left, right };
  });

  return {
    instruction,
    graph: nodes,
  };
};

const runMap = (map: GraphMap, start: string = "AAA", end: string = "ZZZ") => {
  let currNode = map.graph[start];
  let idx = 0;
  while (!currNode.name.endsWith(end)) {
    const direction = map.instruction.charAt(idx % map.instruction.length);
    if (direction === "L") {
      currNode = map.graph[currNode.left];
    } else {
      currNode = map.graph[currNode.right];
    }
    idx += 1;
  }

  return idx;
};

const runMapForGhosts = (map: GraphMap) => {
  const nodesEndingWithA = Object.values(map.graph).filter((node) =>
    node.name.endsWith("A")
  );

  return nodesEndingWithA.map((currNode) => runMap(map, currNode.name, "Z"));
};

const calculateLeastCommonMultiple = (numbers: number[]) => {
  const greatestCommonDivisor = (a: number, b: number): number => {
    return b === 0 ? a : greatestCommonDivisor(b, a % b);
  };

  const leastCommonMultiple = (a: number, b: number): number => {
    return Math.abs(a * b) / greatestCommonDivisor(a, b);
  };

  return numbers.reduce((acc, val) => leastCommonMultiple(acc, val), 1);
};

const partOne = (input: string) => {
  const lines = input.split(/\r\n|\n/).filter((line) => !!line);
  const graphMap = parseMap(lines);
  const result = runMap(graphMap);

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
  const lines = input.split(/\r\n|\n/).filter((line) => !!line);
  const graphMap = parseMap(lines);
  const scores = runMapForGhosts(graphMap);

  const result = calculateLeastCommonMultiple(scores);

  console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);
