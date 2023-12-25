// --- Day 17: Clumsy Crucible ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

type DirIdx = 0 | 1 | 2 | 3;
type Coord = [number, number];

const MaxStraight = 3;
const MinStraightUltra = 4;
const MaxStraightUltra = 10;

const Dirs: [Coord, Coord, Coord, Coord] = [
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 0],
];

class Heap<E extends { key: number; priority: number }> {
  binHeap: E[];

  constructor() {
    this.binHeap = [];
  }
  popMin(): E | undefined {
    if (this.binHeap.length === 0) {
      return undefined;
    }
    const min = this.binHeap[0];
    this.binHeap[0] = this.binHeap[this.binHeap.length - 1];
    this.binHeap.pop();
    if (this.binHeap.length > 0) {
      this.diveDown(0);
    }
    return min;
  }
  push(elem: E): void {
    this.binHeap.push(elem);
    this.floatUp(this.binHeap.length - 1);
  }
  floatUp(index: number): void {
    const cElem = this.binHeap[index];
    const cPrio = cElem.priority;
    while (index > 0) {
      const parent = ~~((index - 1) / 2);
      if (this.binHeap[parent].priority <= cPrio) {
        break;
      }
      this.binHeap[index] = this.binHeap[parent];
      index = parent;
    }
    this.binHeap[index] = cElem;
  }
  diveDown(index: number): void {
    const cElem = this.binHeap[index];
    const cPrio = cElem.priority;
    while (true) {
      const leftPrio = this.binHeap[index * 2 + 1]?.priority ?? Infinity;
      const rightPrio = this.binHeap[index * 2 + 2]?.priority ?? Infinity;
      if (cPrio <= leftPrio && cPrio <= rightPrio) {
        break;
      }
      const minIdx = index * 2 + (leftPrio < rightPrio ? 1 : 2);
      this.binHeap[index] = this.binHeap[minIdx];
      index = minIdx;
    }
    this.binHeap[index] = cElem;
  }
}

class Vertex {
  key: number;

  constructor(
    private readonly isPartTwo: boolean,
    private readonly maxI: number,
    private readonly prevDirIdx: DirIdx | -1,
    private readonly prevDirSteps: number,
    private readonly coord: Coord,
    private readonly dest: Coord,
    readonly priority: number
  ) {
    this.key = this.keyForSteps(this.prevDirSteps);
  }
  keyForSteps(prevDirSteps: number): number {
    const coord =
      (this.coord[0] + this.maxI * this.coord[1]) * MaxStraightUltra * 5;
    return coord + prevDirSteps * 5 + this.prevDirIdx;
  }
  isDest(): boolean {
    const [ci, cj] = this.coord;
    const [di, dj] = this.dest;
    const arrived = ci === di && cj === dj;
    const stopped =
      !this.isPartTwo ||
      this.prevDirIdx === -1 ||
      this.prevDirSteps >= MinStraightUltra;
    return arrived && stopped;
  }
  maxStraight(): number {
    return this.isPartTwo ? MaxStraightUltra : MaxStraight;
  }
  markedKeys(): number[] {
    if (this.isPartTwo && this.prevDirSteps < MinStraightUltra) {
      return [this.keyForSteps(this.prevDirSteps)];
    }
    const ret: number[] = [];
    for (
      let prevDirSteps = this.prevDirSteps;
      prevDirSteps <= this.maxStraight();
      prevDirSteps++
    ) {
      ret.push(this.keyForSteps(prevDirSteps));
    }
    return ret;
  }
  adjacent(p: Problem): Vertex[] {
    const [ci, cj] = this.coord;
    return Dirs.flatMap(([di, dj], dirIdx) => {
      let newDir = true;
      if (
        this.prevDirIdx === dirIdx &&
        this.prevDirSteps >= this.maxStraight()
      ) {
        return [];
      }
      if (this.prevDirIdx !== -1) {
        const diffDirIdx = (this.prevDirIdx + 4 - dirIdx) % 4;
        if (diffDirIdx === 2) {
          return [];
        }
        if (
          this.isPartTwo &&
          (diffDirIdx === 1 || diffDirIdx === 3) &&
          this.prevDirSteps < MinStraightUltra
        ) {
          return [];
        }
        newDir = diffDirIdx !== 0;
      }
      const [ni, nj] = [ci + di, cj + dj];
      const priority = this.priority + (p.heatLoss[ni]?.[nj] ?? Infinity);
      return [
        new Vertex(
          this.isPartTwo,
          this.maxI,
          dirIdx as DirIdx,
          newDir ? 1 : this.prevDirSteps + 1,
          [ni, nj],
          this.dest,
          priority
        ),
      ];
    });
  }
}

class Problem {
  maxI: number;
  maxJ: number;
  heatLoss: number[][];

  constructor(input: string) {
    this.heatLoss = input
      .trim()
      .split("\n")
      .map((l) => Array.from(l.trim()).map(Number));

    this.maxI = this.heatLoss.length;
    this.maxJ = this.heatLoss[0]?.length ?? 0;
  }
  aStar(start: Coord, dest: Coord, maxI: number, isPartTwo = false): number {
    const heap = new Heap<Vertex>();
    const visited = new Set<number>();
    heap.push(new Vertex(isPartTwo, maxI, -1, 0, start, dest, 0));
    while (true) {
      const minVertex = heap.popMin();
      if (minVertex === undefined) {
        return Infinity;
      }
      if (visited.has(minVertex.key)) {
        continue;
      }
      if (minVertex.isDest()) {
        return minVertex.priority;
      }
      for (const markedKey of minVertex.markedKeys()) {
        visited.add(markedKey);
      }
      for (const adjVertex of minVertex.adjacent(this)) {
        if (!visited.has(adjVertex.key)) {
          heap.push(adjVertex);
        }
      }
    }
  }
}

const solveProblem = (input: string, isPartTwo = false) => {
  const problem = new Problem(input);
  const minTotalHeatLoss = problem.aStar(
    [0, 0],
    [problem.maxI - 1, problem.maxJ - 1],
    problem.maxI,
    isPartTwo
  );

  return minTotalHeatLoss;
};

const partOne = (input: string) => {
  const result = solveProblem(input);

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
  const result = solveProblem(input, true);

  console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);
