// --- Day 17: Clumsy Crucible ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

const parseInput = (input: string) =>
  input.split(/\r?\n/).map((line) => line.split("").map(Number));

class Node {
  val: string;
  priority: number;

  constructor(val: string, priority: number) {
    this.val = val;
    this.priority = priority;
  }
}

class PriorityQueue {
  values: Node[];

  constructor() {
    this.values = [];
  }
  enqueue(val: string, priority: number) {
    const newNode = new Node(val, priority);
    this.values.push(newNode);
    this.bubbleUp();
  }
  bubbleUp() {
    let idx = this.values.length - 1;
    const element = this.values[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.values[parentIdx];
      if (element.priority >= parent.priority) break;
      this.values[parentIdx] = element;
      this.values[idx] = parent;
      idx = parentIdx;
    }
  }
  dequeue() {
    const min = this.values[0];
    const end = this.values.pop();
    if (end && this.values.length > 0) {
      this.values[0] = end;
      this.sinkDown();
    }
    return min;
  }
  sinkDown() {
    let idx = 0;
    const length = this.values.length;
    const element = this.values[0];
    while (true) {
      const leftChildIdx = 2 * idx + 1;
      const rightChildIdx = 2 * idx + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.values[leftChildIdx];
        if (leftChild.priority < element.priority) {
          swap = leftChildIdx;
        }
      }
      if (rightChildIdx < length) {
        rightChild = this.values[rightChildIdx];
        if (
          leftChild &&
          ((swap === null && rightChild.priority < element.priority) ||
            (swap !== null && rightChild.priority < leftChild.priority))
        ) {
          swap = rightChildIdx;
        }
      }
      if (swap === null) break;
      this.values[idx] = this.values[swap];
      this.values[swap] = element;
      idx = swap;
    }
  }
}

class WeightedGraph {
  adjacencyList: { [key: string]: Array<{ node: string; weight: number }> };

  constructor() {
    this.adjacencyList = {};
  }
  addVertex(vertex: string) {
    if (!this.adjacencyList[vertex]) this.adjacencyList[vertex] = [];
  }
  addEdge(vertex1: string, vertex2: string, weight: number) {
    const existing = this.adjacencyList[vertex1].find(
      (e) => e.node === vertex2
    );
    if (!existing) {
      this.adjacencyList[vertex1].push({ node: vertex2, weight });
    }
  }
  Dijkstra(start: string, finish: string) {
    const nodes = new PriorityQueue();
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const path: string[] = [];
    let endDist = Number.MAX_SAFE_INTEGER;
    let smallest;
    for (const vertex in this.adjacencyList) {
      if (vertex === start) {
        distances[vertex] = 0;
        nodes.enqueue(vertex, 0);
      } else {
        distances[vertex] = Infinity;
        nodes.enqueue(vertex, Infinity);
      }
      previous[vertex] = null;
    }
    while (nodes.values.length) {
      smallest = nodes.dequeue().val;
      if (smallest === finish) {
        endDist = distances[smallest];
        while (smallest && previous[smallest]) {
          path.push(smallest);
          smallest = previous[smallest];
        }
        break;
      }
      if (smallest || distances[smallest] !== Infinity) {
        for (const neighbor in this.adjacencyList[smallest]) {
          const nextNode = this.adjacencyList[smallest][neighbor];
          const candidate = distances[smallest] + nextNode.weight;
          const nextNeighbor = nextNode.node;
          if (candidate < distances[nextNeighbor]) {
            distances[nextNeighbor] = candidate;
            previous[nextNeighbor] = smallest;
            nodes.enqueue(nextNeighbor, candidate);
          }
        }
      }
    }
    return {
      distance: endDist,
      path: path
        .concat(smallest ?? "")
        .reverse()
        .join("-"),
    };
  }
}

const partOne = (input: string) => {
  let result = 0;
  const data = parseInput(input);

  function createGraph() {
    const graph = new WeightedGraph();

    for (let row = 0; row < data.length; row++) {
      for (let col = 0; col < data[row].length; col++) {
        const options = ["l", "r", "u", "d"];
        for (const a of options) {
          for (const b of options) {
            for (const c of options) {
              let possible = true;
              if (b === "d" && a === "u") possible = false;
              if (b === "u" && a === "d") possible = false;
              if (b === "l" && a === "r") possible = false;
              if (b === "r" && a === "l") possible = false;

              if (b === "d" && c === "u") possible = false;
              if (b === "u" && c === "d") possible = false;
              if (b === "l" && c === "r") possible = false;
              if (b === "r" && c === "l") possible = false;

              const downs = [...`${a}${b}${c}`.matchAll(/d/g)].length;
              const ups = [...`${a}${b}${c}`.matchAll(/u/g)].length;
              const lefts = [...`${a}${b}${c}`.matchAll(/l/g)].length;
              const rights = [...`${a}${b}${c}`.matchAll(/r/g)].length;

              if (downs > row) possible = false;
              if (ups > data.length - 1) possible = false;
              if (lefts > data[row].length - 1) possible = false;
              if (rights > col) possible = false;

              if (possible) {
                graph.addVertex(`${a}${b}${c};${row};${col}`);
                if (row > 0 && [a, b, c].some((e) => e !== "u") && c !== "d") {
                  graph.addVertex(`${b}${c}u;${row - 1};${col}`);
                  graph.addEdge(
                    `${a}${b}${c};${row};${col}`,
                    `${b}${c}u;${row - 1};${col}`,
                    data[row - 1][col]
                  );
                }
                if (
                  row < data.length - 1 &&
                  [a, b, c].some((e) => e !== "d") &&
                  c !== "u"
                ) {
                  graph.addVertex(`${b}${c}d;${row + 1};${col}`);
                  graph.addEdge(
                    `${a}${b}${c};${row};${col}`,
                    `${b}${c}d;${row + 1};${col}`,
                    data[row + 1][col]
                  );
                }
                if (col > 0 && [a, b, c].some((e) => e !== "l") && c !== "r") {
                  graph.addVertex(`${b}${c}l;${row};${col - 1}`);
                  graph.addEdge(
                    `${a}${b}${c};${row};${col}`,
                    `${b}${c}l;${row};${col - 1}`,
                    data[row][col - 1]
                  );
                }
                if (
                  col < data[row].length - 1 &&
                  [a, b, c].some((e) => e !== "r") &&
                  c !== "l"
                ) {
                  graph.addVertex(`${b}${c}r;${row};${col + 1}`);
                  graph.addEdge(
                    `${a}${b}${c};${row};${col}`,
                    `${b}${c}r;${row};${col + 1}`,
                    data[row][col + 1]
                  );
                }
              }
            }
          }
        }
      }
    }

    return graph;
  }

  const graph = createGraph();
  const startPoints = Object.keys(graph.adjacencyList).filter(
    (e) => e.split(";")[1] === "0" && e.split(";")[2] === "0"
  );
  const endPoints = Object.keys(graph.adjacencyList).filter(
    (e) =>
      e.split(";")[1] === `${data.length - 1}` &&
      e.split(";")[2] === `${data[0].length - 1}`
  );
  let shortest = Number.MAX_SAFE_INTEGER;

  let shortCount = 0;
  for (const start of startPoints) {
    for (const end of endPoints) {
      const short = graph.Dijkstra(start, end);
      shortCount++;
      console.log(shortCount, "done of", startPoints.length * endPoints.length);
      if (short.distance < shortest) {
        shortest = short.distance;
      }
    }
  }
  result = shortest;

  console.log(`A-SIDE PUZZLE: ${result}`);
};

partOne(input);
