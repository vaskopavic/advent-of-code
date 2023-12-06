// --- Day 6: Wait For It ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

const parseInput = (input: string) => {
  return input
    .replace(/\r/g, "")
    .split("\n")
    .map((line) => {
      const values = line.split(":")[1].trim();
      return values
        .split(/\s+/g)
        .filter((value) => !isNaN(Number(value)))
        .map(Number);
    });
};

const calculateWins = (time: number, bestDistance: number) => {
  let wins = 0;
  for (let buttonTime = 1; buttonTime < time; buttonTime++) {
    const distance = (time - buttonTime) * buttonTime;
    if (distance > bestDistance) {
      wins++;
    }
  }

  return wins;
};

const partOne = (input: string) => {
  const [times, bestDistances] = parseInput(input);

  let result = 1;
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const bestDistance = bestDistances[i];
    const wins = calculateWins(time, bestDistance);

    result *= wins;
  }

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
  const [times, bestDistances] = parseInput(input);
  const time = Number(times.join(""));
  const bestDistance = Number(bestDistances.join(""));

  const result = calculateWins(time, bestDistance);

  console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);
