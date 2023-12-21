// --- Day 18: Lavaduct Lagoon ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

const parseInput = (input: string): Array<[string, number, string]> => {
  return input.split("\n").map((e) => {
    const [dir, countStr, colorStr] = e.split(" ");
    return [dir, +countStr, colorStr.slice(1, 8)];
  });
};

const partOne = (input: string) => {
  const data = parseInput(input);
  let result = 0;

  const position = [0, 0];
  const max = [0, 0];
  const min = [0, 0];
  const grid: { [key: string]: number[] } = { line0: [0] };
  const vertices: Array<[number, number]> = [[0, 0]];

  for (const ins of data) {
    const [dir, count, _color] = ins;
    if (dir === "R") {
      const newPositions = [...Array(count).keys()].map((e) => position[1] + e);
      const existing = grid[`line${position[0]}`];
      if (existing) {
        existing.push(...newPositions);
      } else {
        grid[`line${position[0]}`] = [...newPositions];
      }

      position[1] += count;
    }
    if (dir === "L") {
      const newPositions = [...Array(count).keys()].map((e) => position[1] - e);
      const existing = grid[`line${position[0]}`];
      if (existing) {
        existing.push(...newPositions);
      } else {
        grid[`line${position[0]}`] = [...newPositions];
      }

      position[1] -= count;
    }
    if (dir === "U") {
      const newPositions = [...Array(count).keys()].map((e) => position[0] - e);
      for (const pos of newPositions) {
        const existing = grid[`line${pos}`];
        if (existing) {
          existing.push(position[1]);
        } else {
          grid[`line${pos}`] = [position[1]];
        }
      }

      position[0] -= count;
    }
    if (dir === "D") {
      const newPositions = [...Array(count).keys()].map((e) => position[0] + e);
      for (const pos of newPositions) {
        const existing = grid[`line${pos}`];
        if (existing) {
          existing.push(position[1]);
        } else {
          grid[`line${pos}`] = [position[1]];
        }
      }

      position[0] += count;
    }
    vertices.push([position[0], position[1]]);

    max[0] = Math.max(position[0], max[0]);
    max[1] = Math.max(position[1], max[1]);
    min[0] = Math.min(position[0], min[0]);
    min[1] = Math.min(position[1], min[1]);
  }

  const lines = [];

  let outer = 0;
  for (let row = min[0]; row <= max[0]; row++) {
    let line = "";
    for (let col = min[1]; col <= max[1]; col++) {
      if (grid[`line${row}`].includes(col)) {
        line += "#";
        outer++;
      } else line += ".";
    }
    lines.push(line);
  }

  const calcPolygonArea = (vertices: Array<[number, number]>) => {
    let total = 0;

    for (let i = 0; i < vertices.length; i++) {
      const addX = vertices[i][0];
      const addY = vertices[i == vertices.length - 1 ? 0 : i + 1][1];
      const subX = vertices[i == vertices.length - 1 ? 0 : i + 1][0];
      const subY = vertices[i][1];

      total += addX * addY * 0.5;
      total -= subX * subY * 0.5;
    }

    return Math.abs(total);
  };

  result = outer / 2 + calcPolygonArea(vertices) + 1;

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
  const data = parseInput(input);
  let result = 0;

  const position = [0, 0];
  const max = [0, 0];
  const min = [0, 0];
  const vertices: Array<[number, number]> = [[0, 0]];
  let outer = 0;

  for (const ins of data) {
    const [_dir, _count, color] = ins;
    const colNum = color.slice(1);

    let dir = "R";
    if (colNum.charAt(5) === "1") dir = "D";
    if (colNum.charAt(5) === "2") dir = "L";
    if (colNum.charAt(5) === "3") dir = "U";

    const count = parseInt(colNum.slice(0, 5), 16);
    if (dir === "R") {
      position[1] += count;
      outer += count;
    }
    if (dir === "L") {
      position[1] -= count;
      outer += count;
    }
    if (dir === "U") {
      position[0] -= count;
      outer += count;
    }
    if (dir === "D") {
      position[0] += count;
      outer += count;
    }
    vertices.push([position[0], position[1]]);

    max[0] = Math.max(position[0], max[0]);
    max[1] = Math.max(position[1], max[1]);
    min[0] = Math.min(position[0], min[0]);
    min[1] = Math.min(position[1], min[1]);
  }

  const calcPolygonArea = (vertices: Array<[number, number]>) => {
    let total = 0;

    for (let i = 0; i < vertices.length; i++) {
      const addX = vertices[i][0];
      const addY = vertices[i == vertices.length - 1 ? 0 : i + 1][1];
      const subX = vertices[i == vertices.length - 1 ? 0 : i + 1][0];
      const subY = vertices[i][1];

      total += addX * addY * 0.5;
      total -= subX * subY * 0.5;
    }

    return Math.abs(total);
  };

  result = outer / 2 + calcPolygonArea(vertices) + 1;

  console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);
