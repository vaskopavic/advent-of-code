// --- Day 14: Parabolic Reflector Dish ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

const cycles = 1000000000;

const parseInput = (input: string) =>
  input.split("\n").map((line) => line.split(""));

const tilt = (input: string[][], direction: "N" | "S" | "W" | "E") => {
  const newInput: string[][] = [...input.map((line) => [...line])];
  let changed = true;
  while (changed) {
    changed = false;
    if (direction === "N" || direction === "S") {
      const [upper, lower] = direction === "N" ? ["O", "."] : [".", "O"];
      for (let i = 0; i < newInput.length - 1; i++) {
        for (let j = 0; j < newInput[i].length; j++) {
          if (newInput[i + 1][j] === upper && newInput[i][j] === lower) {
            newInput[i + 1][j] = lower;
            newInput[i][j] = upper;
            changed = true;
          }
        }
      }
    } else {
      const [upper, lower] = direction === "W" ? ["O", "."] : [".", "O"];
      for (let i = 0; i < newInput[0].length - 1; i++) {
        for (let j = 0; j < newInput.length; j++) {
          if (newInput[j][i + 1] === upper && newInput[j][i] === lower) {
            newInput[j][i + 1] = lower;
            newInput[j][i] = upper;
            changed = true;
          }
        }
      }
    }
  }
  return newInput;
};

const getNorthLoad = (input: string[][]) => {
  return input.reduce(
    (acc, line, index) =>
      (acc += (input.length - index) * line.filter((v) => v === "O").length),
    0
  );
};

const cycle = (input: string[][]) => {
  return (["N", "W", "S", "E"] as const).reduce(
    (acc, direction) => tilt(acc, direction),
    input
  );
};

const getInputHash = (input: string[][]) =>
  input.map((line) => line.join("")).join("\n");

const partOne = (input: string) => {
  const map = parseInput(input);
  const tilted = tilt(map, "N");
  const load = getNorthLoad(tilted);

  console.log(`A-SIDE PUZZLE: ${load}`);
};

const partTwo = (input: string) => {
  let map = parseInput(input);
  const cache = new Map<string, number>();
  for (let i = 0; i < cycles; i++) {
    map = cycle(map);
    const inputStr = getInputHash(map);
    if (cache.has(inputStr)) {
      const cycleLength = i - cache.get(inputStr)!;
      const cycleNumber = Math.floor((cycles - i - 1) / cycleLength);
      i += cycleNumber * cycleLength;
    } else {
      cache.set(inputStr, i);
    }
  }
  const load = getNorthLoad(map);

  console.log(`B-SIDE PUZZLE: ${load}`);
};

partOne(input);
partTwo(input);
