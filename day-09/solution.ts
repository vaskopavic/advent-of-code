// --- Day 9: Mirage Maintenance ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

const parseInput = (input: string) => {
  return input.split("\n").map((line) => [line.split(" ").map(Number)]);
};

const processLine = (line: number[][]) => {
  while (!line[line.length - 1].every((e) => e === 0)) {
    const arr = line[line.length - 1];
    const diffs = [];
    for (let i = 0; i < arr.length - 1; i++) {
      diffs.push(arr[i + 1] - arr[i]);
    }
    line.push(diffs);
  }

  line[line.length - 1].push(0);
};

const partOne = (input: string) => {
  const lines = parseInput(input);

  let sum = 0;
  for (const line of lines) {
    processLine(line);

    for (let i = line.length - 2; i >= 0; i--) {
      line[i].push((line[i]?.at(-1) ?? 0) + (line[i + 1]?.at(-1) ?? 0));
    }
    sum += line[0]?.at(-1) ?? 0;
  }

  console.log(`A-SIDE PUZZLE: ${sum}`);
};

const partTwo = (input: string) => {
  const lines = parseInput(input);

  let sum = 0;
  for (const line of lines) {
    processLine(line);

    for (let i = line.length - 2; i >= 0; i--) {
      line[i].unshift(line[i][0] - line[i + 1][0]);
    }
    sum += line[0][0];
  }

  console.log(`B-SIDE PUZZLE: ${sum}`);
};

partOne(input);
partTwo(input);
