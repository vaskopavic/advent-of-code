// --- Day 20: Pulse Propagation ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

type Module = { next: string[]; value?: boolean | { [key: string]: boolean } };

const parseInput = (input: string) => {
  const final: { [key: string]: Module } = {};
  input.split("\n").forEach((e) => {
    const [name, next] = e.split(" -> ");
    final[name] = {
      next: next.split(", ").map((e) => {
        let cleanNext = e.trim();
        if (cleanNext.endsWith("\r")) {
          cleanNext = cleanNext.slice(0, -1);
        }
        if (input.indexOf(`%${cleanNext} ->`) >= 0) return `%${cleanNext}`;
        if (input.indexOf(`&${cleanNext} ->`) >= 0) return `&${cleanNext}`;
        return cleanNext;
      }),
    };
  });

  return final;
};

const calculateLeastCommonMultiple = (a: number, b: number): number => {
  const greatestCommonDivisor = (a: number, b: number): number => {
    return b === 0 ? a : greatestCommonDivisor(b, a % b);
  };

  const leastCommonMultiple = (a: number, b: number): number => {
    return Math.abs(a * b) / greatestCommonDivisor(a, b);
  };

  return leastCommonMultiple(a, b);
};

const partOne = (input: string) => {
  const data = parseInput(input);
  let result = 0;

  for (const module in data) {
    if (module.charAt(0) === "%") {
      data[module].value = false;
    } else if (module.charAt(0) === "&") {
      data[module].value = {};
      Object.keys(data)
        .filter((m) => data[m].next.includes(module))
        .forEach(
          (m) => ((data[module].value as { [key: string]: boolean })[m] = false)
        );
    }
  }

  let highPulsesSent = 0;
  let lowPulsesSent = 0;
  const signalsToSend: Array<[string, string, boolean]> = [];

  const process = (prev: string, moduleName: string, on: boolean) => {
    const module = data[moduleName];
    if (moduleName.charAt(0) === "%" && !on) {
      module.value = !module.value;
      for (const nextModule of module.next) {
        signalsToSend.push([moduleName, nextModule, module.value]);
      }
    } else if (moduleName.charAt(0) === "&") {
      (module.value as { [key: string]: boolean })[prev] = on;
      let toSend = true;
      if (
        Object.keys(module.value as { [key: string]: boolean }).every(
          (e) => !!(module.value as { [key: string]: boolean })[e]
        )
      ) {
        toSend = false;
      }

      for (const nextModule of module.next) {
        signalsToSend.push([moduleName, nextModule, toSend]);
      }
    } else if (moduleName === "broadcaster") {
      for (const nextModule of module.next) {
        signalsToSend.push([moduleName, nextModule, on]);
      }
    }

    return signalsToSend;
  };

  const push = () => {
    signalsToSend.push(["button", "broadcaster", false]);
    while (signalsToSend.length > 0) {
      const iteration = signalsToSend.length;
      for (let i = 0; i < iteration; i++) {
        const signal = signalsToSend.shift();
        if (signal) {
          if (signal[2]) {
            highPulsesSent++;
          } else {
            lowPulsesSent++;
          }
          process(...signal);
        }
      }
    }
  };

  for (let i = 0; i < 1000; i++) {
    push();
  }

  result = highPulsesSent * lowPulsesSent;

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
  const data = parseInput(input);
  let result = 0;

  for (const module in data) {
    if (module.charAt(0) === "%") {
      data[module].value = false;
    } else if (module.charAt(0) === "&") {
      data[module].value = {};
      Object.keys(data)
        .filter((m) => data[m].next.includes(module))
        .forEach(
          (m) => ((data[module].value as { [key: string]: boolean })[m] = false)
        );
    }
  }

  let signalsToSend: Array<[string, string, boolean]> = [];
  const rxEntry =
    Object.keys(data).find((e) => data[e].next.includes("rx")) ?? "";
  const loops: { [key: string]: { cur: number; vals: number[] } } = {};
  Object.keys(data[rxEntry].value as any).forEach((key) => {
    loops[key] = { cur: 0, vals: [] };
  });

  const process = (prev: string, moduleName: string, on: boolean) => {
    const module = data[moduleName];
    if (moduleName.charAt(0) === "%" && !on) {
      module.value = !module.value;
      for (const nextModule of module.next) {
        signalsToSend.push([moduleName, nextModule, module.value]);
      }
    } else if (moduleName.charAt(0) === "&") {
      if (moduleName === rxEntry) {
        Object.keys(data[rxEntry].value as any)
          .filter((e) => (data[rxEntry].value as any)[e] === true)
          .forEach((key) => {
            loops[key].vals.push(loops[key].cur);
            loops[key].cur = 0;
          });
      }
      (module.value as { [key: string]: boolean })[prev] = on;
      let toSend = true;
      if (
        Object.keys(module.value as { [key: string]: boolean }).every(
          (e) => !!(module.value as { [key: string]: boolean })[e]
        )
      ) {
        toSend = false;
      }

      for (const nextModule of module.next) {
        signalsToSend.push([moduleName, nextModule, toSend]);
      }
    } else if (moduleName === "broadcaster") {
      for (const nextModule of module.next) {
        signalsToSend.push([moduleName, nextModule, on]);
      }
    }

    return signalsToSend;
  };

  const push = () => {
    signalsToSend = [["button", "broadcaster", false]];
    while (signalsToSend.length > 0) {
      const iteration = signalsToSend.length;
      for (let i = 0; i < iteration; i++) {
        const signal = signalsToSend.shift();
        if (signal) {
          process(...signal);
        }
      }
    }
  };

  while (Object.keys(loops).some((k) => loops[k].vals.length < 1)) {
    Object.keys(loops).forEach((e) => loops[e].cur++);
    push();
  }

  for (const loopKey in loops) {
    if (result === 0) result = loops[loopKey].vals[0];
    else result = calculateLeastCommonMultiple(result, loops[loopKey].vals[0]);
  }

  console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);
