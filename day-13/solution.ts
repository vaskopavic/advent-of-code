// --- Day 13: Point of Incidence ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

const parseInput = (input: string) => {
  const normalizedInput = input.replace(/\r/g, "");
  return normalizedInput.split("\n\n").map((pattern) => pattern.split("\n"));
};

const transposePattern = (basePattern: string[]) => {
  const pattern = basePattern.map((row) => row.split(""));
  const transposed = pattern[0]?.map((_, colIndex) =>
    pattern.map((row) => row[colIndex])
  );
  return transposed?.map((row) => row.join("")) ?? [];
};

const findReflectionRows = (basePattern: string[], isPartTwo = false) => {
  if (isPartTwo) {
    const rows: number[] = [];
    for (let row = 1; row < basePattern.length; row++) {
      const topSide = basePattern.map((row) => row.slice());
      const bottomSide = topSide.splice(row, topSide.length);
      topSide.reverse();

      const minLength = Math.min(topSide.length, bottomSide.length);
      const top = topSide.slice(0, minLength);
      const bot = bottomSide.slice(0, minLength);

      const isReflection = top.every((el, index) => el === bot[index]);
      if (isReflection) {
        rows.push(row);
      }
    }
    return rows.length > 0 ? rows : null;
  } else {
    for (let row = 1; row < basePattern.length; row++) {
      const topSide = basePattern.map((row) => row.slice());
      const bottomSide = topSide.splice(row, topSide.length);
      topSide.reverse();

      const minLength = Math.min(topSide.length, bottomSide.length);
      const top = topSide.slice(0, minLength);
      const bot = bottomSide.slice(0, minLength);

      const isReflection = top.every((el, index) => el === bot[index]);
      if (isReflection) {
        return row;
      }
    }
    return null;
  }
};

const partOne = (input: string) => {
  const map = parseInput(input);
  const result = map
    .map((basePattern) => {
      const horizontal = findReflectionRows(basePattern) as number;
      const vertical = findReflectionRows(
        transposePattern(basePattern)
      ) as number;

      return { horizontal, vertical };
    })
    .map(
      ({ horizontal, vertical }) => (vertical ?? 0) + 100 * (horizontal ?? 0)
    )
    .reduce((a, b) => a + b, 0);

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
  const map = parseInput(input);

  const baseReflections = map.map((basePattern) => {
    const horizontal = findReflectionRows(basePattern, true);
    const vertical = findReflectionRows(transposePattern(basePattern), true);

    return {
      horizontal: Array.isArray(horizontal) ? horizontal[0] : null,
      vertical: Array.isArray(vertical) ? vertical[0] : null,
    };
  });

  const result = map
    .map((basePattern, index) => {
      const originalReflection = baseReflections[index]!;

      const horizontalSet = new Set<number>();
      const verticalSet = new Set<number>();

      for (let y = 0; y < basePattern.length; y++) {
        for (let x = 0; x < basePattern[y]!.length; x++) {
          const pattern = basePattern.map((row) => row.split(""));
          pattern[y]![x] = pattern[y]![x] === "." ? "#" : ".";
          const patternReduced = pattern.map((row) => row.join(""));

          const { horizontal, vertical } = {
            horizontal: findReflectionRows(patternReduced, true),
            vertical: findReflectionRows(
              transposePattern(patternReduced),
              true
            ),
          };

          if (Array.isArray(horizontal)) {
            horizontal
              .filter(
                (value: number) => value !== originalReflection.horizontal
              )
              .forEach((value: number) => horizontalSet.add(value));
          }

          if (Array.isArray(vertical)) {
            vertical
              .filter((value: number) => value !== originalReflection.vertical)
              .forEach((value: number) => verticalSet.add(value));
          }
        }
      }

      return {
        horizontal: [...horizontalSet][0],
        vertical: [...verticalSet][0],
      };
    })
    .map(
      ({ horizontal, vertical }) => (vertical ?? 0) + 100 * (horizontal ?? 0)
    )
    .reduce((a, b) => a + b, 0);

  console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);
