// --- Day 23: A Long Walk ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

const parseInput = (input: string) => input.replace(/\r/g, "").split("\n");

const partOne = (input: string) => {
  const data = parseInput(input);
  let result = 0;

  const step = (row: number, col: number, visited: Array<string>) => {
    if (visited.includes(`${row};${col}`)) return;
    const currChar = data[row].charAt(col);
    if (currChar === ">") {
      if (col < data[0].length - 1 && data[row].charAt(col + 1) !== "#") {
        visited.push(`${row};${col}`);
        step(row, col + 1, [...visited]);
      }
    } else if (currChar === "<") {
      if (col > 0 && data[row].charAt(col - 1) !== "#") {
        visited.push(`${row};${col}`);
        step(row, col - 1, [...visited]);
      }
    } else if (currChar === "^") {
      if (row > 0 && data[row - 1].charAt(col) !== "#") {
        visited.push(`${row};${col}`);
        step(row - 1, col, [...visited]);
      }
    } else if (currChar === "v") {
      if (row < data.length - 1 && data[row + 1].charAt(col) !== "#") {
        visited.push(`${row};${col}`);
        step(row + 1, col, [...visited]);
      }
    } else {
      visited.push(`${row};${col}`);
      result = Math.max(result, visited.length - 1);

      if (row < data.length - 1 && data[row + 1].charAt(col) !== "#") {
        step(row + 1, col, [...visited]);
      }
      if (row > 0 && data[row - 1].charAt(col) !== "#") {
        step(row - 1, col, [...visited]);
      }
      if (col > 0 && data[row].charAt(col - 1) !== "#") {
        step(row, col - 1, [...visited]);
      }
      if (col < data[0].length - 1 && data[row].charAt(col + 1) !== "#") {
        step(row, col + 1, [...visited]);
      }
    }
  };

  step(0, 1, []);

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = async (input: string) => {
  const data = parseInput(input);
  console.log(data);
  let result = 0;

  const graph: { [key: string]: Array<{ node: string; distance: number }> } = {
    "0;1": [], // start
    [`${data.length - 1};${data[0].length - 2}`]: [], // end
  };

  const edgesVisited: string[] = [];

  const pass = async (
    prevNode: string,
    row: number,
    col: number,
    currDist: number,
    visited: string[]
  ): Promise<void> => {
    const branches: Array<[number, number]> = [];

    if (row < data.length - 1 && data[row + 1].charAt(col) !== "#") {
      const next: [number, number] = [row + 1, col];
      if (!visited.includes(next.join(";"))) {
        branches.push(next);
      }
    }
    if (row > 0 && data[row - 1].charAt(col) !== "#") {
      const next: [number, number] = [row - 1, col];
      if (!visited.includes(next.join(";"))) {
        branches.push(next);
      }
    }
    if (col > 0 && data[row].charAt(col - 1) !== "#") {
      const next: [number, number] = [row, col - 1];
      if (!visited.includes(next.join(";"))) {
        branches.push(next);
      }
    }
    if (col < data[0].length - 1 && data[row].charAt(col + 1) !== "#") {
      const next: [number, number] = [row, col + 1];
      if (!visited.includes(next.join(";"))) {
        branches.push(next);
      }
    }

    const nodeKey = `${row};${col}`;
    visited.push(nodeKey);

    if (branches.length > 1 || graph[nodeKey]) {
      if (edgesVisited.includes(`${nodeKey}-${prevNode}`)) {
        return Promise.resolve();
      }

      if (!graph[nodeKey]) {
        graph[nodeKey] = [];
      }
      if (!graph[prevNode].find((e) => e.node === nodeKey)) {
        if (prevNode !== nodeKey) {
          graph[prevNode].push({ node: nodeKey, distance: currDist });
        }
      }

      for (const branch of branches) {
        await pass(nodeKey, ...branch, 1, [...visited]);
      }

      edgesVisited.push(`${nodeKey}-${prevNode}`);
    } else if (branches.length === 1) {
      await pass(prevNode, ...branches[0], currDist + 1, [...visited]);
    }
    Promise.resolve();
  };

  await pass("0;1", 0, 1, 0, ["0;1"]);

  function step(
    row: number,
    col: number,
    visited: Array<string>,
    dist: number
  ) {
    const nodeKey = `${row};${col}`;
    if (visited.includes(nodeKey)) {
      return;
    }
    visited.push(nodeKey);
    if (row === data.length - 1 && col === data[row].length - 2) {
      result = Math.max(result, dist);
      return;
    }

    const node = graph[nodeKey];

    for (const branch of node) {
      const [nextRow, nextCol] = branch.node.split(";").map(Number);
      step(nextRow, nextCol, [...visited], dist + branch.distance);
    }
  }

  step(0, 1, [], 0);

  console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);
