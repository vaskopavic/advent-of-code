// --- Day 11: Cosmic Expansion ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

interface Galaxy {
  x: number;
  y: number;
}

const expansionFactor = 999999;

const parseInput = (input: string) => {
  const lines = input.split("\n");
  return lines.map((line) => line.split(""));
};

const insertRowAtIndex = (
  array: string[][],
  index: number,
  rowCount: number = 1
) => {
  const rowLength = array[0].length;
  const newRow = new Array(rowLength).fill(".");

  const newArray: string[][] = [];

  for (let i = 0; i <= index; i++) {
    newArray.push(array[i]);
  }

  for (let i = 0; i < rowCount; i++) {
    newArray.push([...newRow]);
  }

  for (let i = index + 1; i < array.length; i++) {
    newArray.push(array[i]);
  }
  return newArray;
};

const insertColumnsAtIndex = (
  array: string[][],
  index: number,
  columnCount: number = 1
): string[][] => {
  return array.map((row) => {
    return [
      ...row.slice(0, index),
      ...new Array(columnCount).fill("."),
      ...row.slice(index),
    ];
  });
};

const expandMap = (map: string[][]) => {
  for (let i = 0; i < map.length; i++) {
    let hasGalaxy = false;
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "#") {
        hasGalaxy = true;
        break;
      }
    }
    if (!hasGalaxy) {
      map = insertRowAtIndex(map, i, 1);
      i += 1;
    }
  }

  for (let k = 0; k < map[0].length; k++) {
    let hasGalaxy = false;
    for (let l = 0; l < map.length; l++) {
      if (map[l][k] === "#") {
        hasGalaxy = true;
        break;
      }
    }
    if (!hasGalaxy) {
      map = insertColumnsAtIndex(map, k, 1);
      k += 1;
    }
  }
  return map;
};

const getAllGalaxies = (map: string[][]) => {
  let galaxies: Galaxy[] = [];
  for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "#") {
        galaxies.push({ x: i, y: j });
      }
    }
  }
  return galaxies;
};

const getEmptyRows = (map: string[][]) => {
  let emptyRows: number[] = [];
  for (let i = 0; i < map.length; i++) {
    let hasGalaxy = false;
    for (let j = 0; j < map[i].length; j++) {
      if (map[i][j] === "#") {
        hasGalaxy = true;
        break;
      }
    }
    if (!hasGalaxy) {
      emptyRows.push(i);
    }
  }
  return emptyRows;
};

const getEmptyColumns = (map: string[][]) => {
  let emptyColumns: number[] = [];
  for (let k = 0; k < map[0].length; k++) {
    let hasGalaxy = false;
    for (let l = 0; l < map.length; l++) {
      if (map[l][k] === "#") {
        hasGalaxy = true;
        break;
      }
    }
    if (!hasGalaxy) {
      emptyColumns.push(k);
    }
  }
  return emptyColumns;
};

const calculateShortestPath = (
  start: Galaxy,
  end: Galaxy,
  emptyRows: number[] = [],
  emptyColumns: number[] = []
) => {
  const horizontalDistance = Math.abs(start.x - end.x);
  const verticalDistance = Math.abs(start.y - end.y);

  let distance = horizontalDistance + verticalDistance;

  const minX = Math.min(start.x, end.x);
  const maxX = Math.max(start.x, end.x);

  for (let i = minX; i < maxX; i++) {
    if (emptyRows.includes(i)) {
      distance += expansionFactor;
    }
  }

  const minY = Math.min(start.y, end.y);
  const maxY = Math.max(start.y, end.y);

  for (let i = minY; i < maxY; i++) {
    if (emptyColumns.includes(i)) {
      distance += expansionFactor;
    }
  }
  return distance;
};

const partOne = (input: string) => {
  const map = parseInput(input);
  const expandedMap = expandMap(map);
  const galaxies = getAllGalaxies(expandedMap);

  let distance = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      distance += calculateShortestPath(galaxies[i], galaxies[j]);
    }
  }

  console.log(`A-SIDE PUZZLE: ${distance}`);
};

const partTwo = (input: string) => {
  const map = parseInput(input);
  const galaxies = getAllGalaxies(map);
  const emptyRows: number[] = getEmptyRows(map);
  const emptyColumns: number[] = getEmptyColumns(map);

  let distance = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      distance += calculateShortestPath(
        galaxies[i],
        galaxies[j],
        emptyRows,
        emptyColumns
      );
    }
  }

  console.log(`B-SIDE PUZZLE: ${distance}`);
};

partOne(input);
partTwo(input);
