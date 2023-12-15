// --- Day 15: Lens Library ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

interface Lens {
  label: string;
  focalLength: number;
}

interface System {
  [key: number]: Lens[];
}

const getHashValue = (s: string): number => {
  let runningValue = 0;
  for (let i = 0; i < s.length; i++) {
    runningValue += s[i].charCodeAt(0);
    runningValue = (runningValue * 17) % 256;
  }
  return runningValue;
};

const partOne = (input: string) => {
  const result = input
    .split(",")
    .reduce((acc, item) => acc + getHashValue(item), 0);

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
  const system: System = {};

  const instructions = input.split(",");

  for (let instruction of instructions) {
    const add = instruction.includes("=");
    const separator = add ? "=" : "-";

    const [label, rest] = instruction.split(separator);
    const boxNumber = getHashValue(label);

    if (!system[boxNumber]) system[boxNumber] = [];

    if (add) {
      const focalLength = parseInt(rest);

      const lensIndex = system[boxNumber].findIndex(
        (item) => item.label === label
      );
      if (lensIndex === -1) {
        system[boxNumber].push({
          label: label,
          focalLength: focalLength,
        });
      } else {
        system[boxNumber][lensIndex] = {
          label: label,
          focalLength: focalLength,
        };
      }
    } else {
      system[boxNumber] = system[boxNumber].filter(
        (item) => item.label !== label
      );
    }
  }

  const result = Object.keys(system).reduce((acc, item) => {
    const boxIndex = parseInt(item);
    const box = system[boxIndex];
    let value = 0;

    for (let i = 0; i < box.length; i++) {
      value += (boxIndex + 1) * (i + 1) * box[i].focalLength;
    }

    return acc + value;
  }, 0);

  console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);
