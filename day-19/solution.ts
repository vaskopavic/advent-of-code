// --- Day 19: Aplenty ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

type Workflows = { [key: string]: string[] };
type Part = [number, number, number, number];

const parseInput = (input: string): [Workflows, Array<Part>] => {
  const [workflowStrings, partStrings] = input.trim().split(/\n\s*\n/);
  const workflows: Workflows = {};
  workflowStrings.split("\n").forEach((w) => {
    const [name, rest] = w.split("{");
    const trimmed = rest.slice(0, -2);
    workflows[name] = trimmed.split(",");
  });

  const parts: Array<Part> = partStrings.split("\n").map((e) => {
    const [, x, m, a, s] =
      e.match(/\{x=(\d+),m=(\d+),a=(\d+),s=(\d+)\}/)?.map(Number) || [];
    return [x, m, a, s];
  });

  return [workflows, parts];
};

const partOne = (input: string) => {
  const data = parseInput(input);
  const [workflows, parts] = data;
  let result = 0;

  const accepted: Part[] = [];

  const flow = (wf: string[], part: Part): void => {
    for (const step of wf) {
      const [condition, next] = step.split(":");
      if (!next) {
        if (condition === "A") {
          accepted.push(part);
          return;
        }
        if (condition === "R") return;
        return flow(workflows[condition], part);
      }

      if (condition.includes("<")) {
        const [e, limit] = condition.split("<");
        if (e === "x" && part[0] < Number(limit)) {
          if (next === "A") {
            accepted.push(part);
            return;
          }
          if (next === "R") return;
          return flow(workflows[next], part);
        }
        if (e === "m" && part[1] < Number(limit)) {
          if (next === "A") {
            accepted.push(part);
            return;
          }
          if (next === "R") return;
          return flow(workflows[next], part);
        }
        if (e === "a" && part[2] < Number(limit)) {
          if (next === "A") {
            accepted.push(part);
            return;
          }
          if (next === "R") return;
          return flow(workflows[next], part);
        }
        if (e === "s" && part[3] < Number(limit)) {
          if (next === "A") {
            accepted.push(part);
            return;
          }
          if (next === "R") return;
          return flow(workflows[next], part);
        }
      }

      if (condition.includes(">")) {
        const [e, limit] = condition.split(">");
        if (e === "x" && part[0] > Number(limit)) {
          if (next === "A") {
            accepted.push(part);
            return;
          }
          if (next === "R") return;
          return flow(workflows[next], part);
        }
        if (e === "m" && part[1] > Number(limit)) {
          if (next === "A") {
            accepted.push(part);
            return;
          }
          if (next === "R") return;
          return flow(workflows[next], part);
        }
        if (e === "a" && part[2] > Number(limit)) {
          if (next === "A") {
            accepted.push(part);
            return;
          }
          if (next === "R") return;
          return flow(workflows[next], part);
        }
        if (e === "s" && part[3] > Number(limit)) {
          if (next === "A") {
            accepted.push(part);
            return;
          }
          if (next === "R") return;
          return flow(workflows[next], part);
        }
      }
    }
  };

  for (const part of parts) {
    const wf = workflows["in"];
    flow(wf, part);
  }
  result = accepted.reduce(
    (prev, curr) => prev + curr[0] + curr[1] + curr[2] + curr[3],
    0
  );

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const deepCopy = <T>(src: T): T => {
  const target = Array.isArray(src) ? ([] as T) : ({} as T);
  for (const prop in src) {
    const value = src[prop];
    if (value && typeof value === "object") {
      target[prop] = deepCopy(value);
    } else {
      target[prop] = value;
    }
  }
  return target;
};

const partTwo = (input: string) => {
  const data = parseInput(input);
  const [workflows, _parts] = data;
  let result = 0;

  let accepted = 0;
  let rejected = 0;

  type Struct = {
    [key: string]: [number, number];
  };
  const getValue = (wf: string[], curr: Struct) => {
    for (const step of wf) {
      const [condition, next] = step.split(":");

      if (!next) {
        const total = Object.keys(curr).reduce(
          (p, k) => p * (curr[k][1] - curr[k][0] + 1),
          1
        );
        if (condition === "A") {
          accepted += total;
        } else if (condition === "R") {
          rejected += total;
        } else {
          getValue(workflows[condition], deepCopy(curr));
        }
      } else if (condition.includes("<")) {
        const [e, limit] = condition.split("<");
        const newVal = Math.min(Number(limit) - 1, curr[e][1]);
        const total = Object.keys(curr).reduce(
          (p, k) => p * ((k === e ? newVal : curr[k][1]) - curr[k][0] + 1),
          1
        );
        if (next === "A") {
          accepted += total;
        } else if (next === "R") {
          rejected += total;
        } else {
          getValue(workflows[next], {
            ...deepCopy(curr),
            [e]: [curr[e][0], newVal],
          });
        }
        curr[e][0] = Math.max(Number(limit), curr[e][0]);
      } else if (condition.includes(">")) {
        const [e, limit] = condition.split(">");
        const newVal = Math.max(Number(limit) + 1, curr[e][0]);
        const total = Object.keys(curr).reduce(
          (p, k) => p * (curr[k][1] - (k === e ? newVal : curr[k][0]) + 1),
          1
        );
        if (next === "A") {
          accepted += total;
        } else if (next === "R") {
          rejected += total;
        } else {
          getValue(workflows[next], {
            ...deepCopy(curr),
            [e]: [newVal, curr[e][1]],
          });
        }
        curr[e][1] = Math.min(Number(limit), curr[e][1]);
      }
    }
  };

  const initial: Struct = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  };
  getValue(workflows.in, initial);
  result = accepted;

  console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);
