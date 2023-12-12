// --- Day 12: Hot Springs ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

const parseInput = (input: string) => input.split("\n");

const getLineOptions = (line: string, isPartTwo = false) => {
  const [_map, _legend] = line.split(" ");

  if (isPartTwo) {
    let legend = [0];
    let map = "";
    for (let i = 0; i < 5; i++) {
      map += _map + "?";
      legend = legend.concat(_legend.split(",").map((n) => +n));
    }

    const cache: number[][] = [];
    for (let i = 0; i < map.length; i++) {
      cache[i] = [];
    }

    let count = (mapIdx: number, legendIdx: number) => {
      if (mapIdx == -1 && legendIdx == 0) return 1;
      if (cache[mapIdx]) return cache[mapIdx][legendIdx] ?? 0;
      return 0;
    };

    for (let legendIdx = 0; legendIdx < legend.length; legendIdx++) {
      for (let mapIdx = 0; mapIdx < map.length; mapIdx++) {
        let acc = 0;
        if (map[mapIdx] !== "#") acc += count(mapIdx - 1, legendIdx);
        if (legendIdx > 0) {
          let docount = true;
          for (let k = 1; k <= legend[legendIdx]; k++) {
            if (map[mapIdx - k] == ".") docount = false;
          }
          if (map[mapIdx] == "#") docount = false;
          if (docount)
            acc += count(mapIdx - legend[legendIdx] - 1, legendIdx - 1);
        }
        cache[mapIdx][legendIdx] = acc;
      }
    }
    return cache.at(-1)?.at(-1) ?? 0;
  } else {
    const map = _map.split("");

    const options = map.reduce((acc, c, i) => {
      let local = acc;
      if (c !== "?") {
        if (local.length === 0) {
          local.push(c);
        } else {
          local = local.map((l) => [...l, c].join(""));
        }
      } else {
        if (local.length === 0) {
          local.push(".", "#");
        } else {
          local = [
            ...local.flatMap((l) => [...l, "."].join("")),
            ...local.flatMap((l) => [...l, "#"].join("")),
          ];
        }
      }

      return local;
    }, [] as string[]);

    const legend = _legend.split(",").map((n) => parseInt(n, 10));

    const validOptions = options.filter((o) => {
      const l = o.split(".").filter(Boolean);

      const num = l.map((n) => n.toString().length);
      return legend.length === l.length && legend.every((n, i) => n === num[i]);
    });

    return validOptions;
  }
};

const countTotalArrangements = (lines: string[], isPartTwo = false) => {
  const validMaps = lines.map((line) => getLineOptions(line, isPartTwo));

  return validMaps.reduce((acc, n) => {
    if (Array.isArray(n)) {
      return +acc + n.length;
    } else {
      return +acc + +n;
    }
  }, 0);
};

const partOne = (input: string) => {
  const lines = parseInput(input);
  const result = countTotalArrangements(lines);

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
  const lines = parseInput(input);
  const result = countTotalArrangements(lines, true);

  console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);
