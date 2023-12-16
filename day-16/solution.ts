// --- Day 16: The Floor Will Be Lava ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

type DirIdx = 0 | 1 | 2 | 3;
type Coord = [number, number];

const Dirs: [Coord, Coord, Coord, Coord] = [
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 0],
];
const ReflForward: [DirIdx, DirIdx, DirIdx, DirIdx] = [1, 0, 3, 2];
const ReflBackward: [DirIdx, DirIdx, DirIdx, DirIdx] = [3, 2, 1, 0];
const SplitterVert: [DirIdx[], DirIdx[], DirIdx[], DirIdx[]] = [
  [1, 3],
  [1],
  [1, 3],
  [3],
];
const SplitterHorz: [DirIdx[], DirIdx[], DirIdx[], DirIdx[]] = [
  [0],
  [0, 2],
  [2],
  [0, 2],
];

const addCoord = ([i1, j1]: Coord, [i2, j2]: Coord): Coord => {
  return [i1 + i2, j1 + j2];
};

class Problem {
  maxI: number;
  maxJ: number;
  matrix: string[];
  energized: boolean[][][];

  constructor(input: string) {
    this.matrix = input
      .trim()
      .split("\n")
      .map((s) => s.trim());

    this.maxI = this.matrix.length;
    this.maxJ = this.matrix[0]?.length ?? 0;

    this.energized = Array(this.maxI)
      .fill(0)
      .map((_zero) => {
        return Array(this.maxJ)
          .fill(0)
          .map((_zero) => [false, false, false, false]);
      });
  }

  cleanEnergized(): void {
    this.energized = Array(this.maxI)
      .fill(0)
      .map((_zero) => {
        return Array(this.maxJ)
          .fill(0)
          .map((_zero) => [false, false, false, false]);
      });
  }

  markDir(dirIdx: DirIdx, [i, j]: Coord): boolean {
    const prev = this.energized[i]?.[j]?.[dirIdx] ?? true;
    if (prev) {
      return true;
    }

    this.energized[i][j][dirIdx] = true;
    return prev;
  }

  matrixAt([i, j]: Coord): string {
    return this.matrix[i].charAt(j);
  }

  energizedCells(): number {
    let sum = 0;

    for (let i = 0; i < this.maxI; i++) {
      for (let j = 0; j < this.maxJ; j++) {
        sum += this.energized[i][j].some(Boolean) ? 1 : 0;
      }
    }

    return sum;
  }

  edgeRays(): Array<[DirIdx, Coord]> {
    const rowRays: Array<[DirIdx, Coord]> = [
      ...Array(this.maxI).keys(),
    ].flatMap((row) => [
      [0, [row, 0]],
      [2, [row, this.maxJ - 1]],
    ]);
    const colRays: Array<[DirIdx, Coord]> = [
      ...Array(this.maxJ).keys(),
    ].flatMap((col) => [
      [1, [this.maxI - 1, col]],
      [3, [0, col]],
    ]);

    return rowRays.concat(colRays);
  }

  shootRayIn(dirIdx: DirIdx, coord: Coord): void {
    if (this.markDir(dirIdx, coord)) {
      return;
    }

    const newDirForward = ReflForward[dirIdx];
    const newDirBackward = ReflBackward[dirIdx];

    switch (this.matrixAt(coord)) {
      case "/":
        this.shootRayIn(newDirForward, addCoord(coord, Dirs[newDirForward]));
        break;

      case "\\":
        this.shootRayIn(newDirBackward, addCoord(coord, Dirs[newDirBackward]));
        break;

      case "|":
        for (const newDir of SplitterVert[dirIdx]) {
          this.shootRayIn(newDir, addCoord(coord, Dirs[newDir]));
        }
        break;

      case "-":
        for (const newDir of SplitterHorz[dirIdx]) {
          this.shootRayIn(newDir, addCoord(coord, Dirs[newDir]));
        }
        break;

      case ".":
        this.shootRayIn(dirIdx, addCoord(coord, Dirs[dirIdx]));
        break;

      default:
        break;
    }
  }
}

const partOne = (input: string) => {
  const problem = new Problem(input);
  problem.shootRayIn(0, [0, 0]);
  const result = problem.energizedCells();

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
  const problem = new Problem(input);

  let max = 0;
  for (const [dirIdx, coord] of problem.edgeRays()) {
    problem.cleanEnergized();
    problem.shootRayIn(dirIdx, coord);
    max = Math.max(max, problem.energizedCells());
  }

  console.log(`B-SIDE PUZZLE: ${max}`);
};

partOne(input);
partTwo(input);
