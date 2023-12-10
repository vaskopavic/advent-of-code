// --- Day 10: Pipe Maze ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

const parseInput = (input: string, startShape: string) => {
  let start: [number, number] = [0, 0];

  const lines = input.split("\n").map((line, rowIndex) => {
    let characters = line.split("");
    let startIndex = characters.indexOf("S");

    if (startIndex !== -1) {
      start = [startIndex, rowIndex];
      characters = characters.map((char) => (char === "S" ? startShape : char));
    }

    return characters;
  });

  return { start, lines };
};

const visit = (
  lines: string[][],
  visited: [number, number][],
  [x, y]: [number, number]
) => {
  if (visited.some((v) => v[0] === x && v[1] === y)) return;
  visited.push([x, y]);
  switch (lines[y][x]) {
    case "F":
      visit(lines, visited, [x + 1, y]);
      visit(lines, visited, [x, y + 1]);
      break;
    case "L":
      visit(lines, visited, [x, y - 1]);
      visit(lines, visited, [x + 1, y]);
      break;
    case "-":
      visit(lines, visited, [x - 1, y]);
      visit(lines, visited, [x + 1, y]);
      break;
    case "|":
      visit(lines, visited, [x, y - 1]);
      visit(lines, visited, [x, y + 1]);
      break;
    case "J":
      visit(lines, visited, [x - 1, y]);
      visit(lines, visited, [x, y - 1]);
      break;
    case "7":
      visit(lines, visited, [x - 1, y]);
      visit(lines, visited, [x, y + 1]);
      break;
  }
};

const partOne = (input: string) => {
  const { start, lines } = parseInput(input, "L");
  const visited: [number, number][] = [];

  visit(lines, visited, start);
  const result = visited.length / 2;

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
  const { start, lines } = parseInput(input, "F");
  let visited: [number, number][] = [];

  visit(lines, visited, start);
  let result = 0;

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      if (!visited.some((v) => v[0] === x && v[1] === y)) {
        lines[y][x] = ".";
      }
    }
  }

  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[y].length; x++) {
      let intersectionsRight = 0;
      let intersectionsLeft = 0;
      let intersectionsDown = 0;
      let intersectionsUp = 0;
      if (lines[y][x] === ".") {
        let pathRight = lines[y].slice(x + 1).join("");
        pathRight = pathRight.replaceAll(".", "");
        pathRight = pathRight.replaceAll("-", "");
        pathRight = pathRight.replaceAll("FJ", "|");
        pathRight = pathRight.replaceAll("L7", "|");
        intersectionsRight = Array.from(pathRight).filter(
          (d) => d === "|"
        ).length;
        let pathLeft = lines[y].slice(0, x).join("");
        pathLeft = pathLeft.replaceAll(".", "");
        pathLeft = pathLeft.replaceAll("-", "");
        pathLeft = pathLeft.replaceAll("FJ", "|");
        pathLeft = pathLeft.replaceAll("L7", "|");
        intersectionsLeft = Array.from(pathLeft).filter(
          (d) => d === "|"
        ).length;
        let pathDown = lines
          .slice(y + 1)
          .map((d) => d[x])
          .join("");
        pathDown = pathDown.replaceAll(".", "");
        pathDown = pathDown.replaceAll("|", "");
        pathDown = pathDown.replaceAll("FJ", "-");
        pathDown = pathDown.replaceAll("7L", "-");
        intersectionsDown = Array.from(pathDown).filter(
          (d) => d === "-"
        ).length;
        let pathUp = lines
          .slice(0, y)
          .map((d) => d[x])
          .join("");
        pathUp = pathUp.replaceAll(".", "");
        pathUp = pathUp.replaceAll("|", "");
        pathUp = pathUp.replaceAll("FJ", "-");
        pathUp = pathUp.replaceAll("7L", "-");
        intersectionsUp = Array.from(pathUp).filter((d) => d === "-").length;
      }

      if (
        intersectionsRight % 2 === 1 &&
        intersectionsDown % 2 === 1 &&
        intersectionsUp % 2 === 1 &&
        intersectionsLeft % 2 === 1
      ) {
        result++;
      }
    }
  }

  console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);
