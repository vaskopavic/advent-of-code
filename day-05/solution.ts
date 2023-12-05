// --- Day 5: If You Give A Seed A Fertilizer ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

type ConversionMap = {
    srcStart: number;
    srcEnd: number;
    destStart: number;
    destEnd: number;
  };
  
  const parseInput = (input: string) => {
    const sections = input.split("\n\n");
    const seeds = sections.shift()!.split(":")[1].trim().split(" ").map(Number);
    const conversionMappings = sections.map((section) =>
      section
        .split("\n")
        .slice(1)
        .map((line) => line.split(" ").map(Number))
        .map(([destStart, srcStart, length]) => ({
          destStart,
          destEnd: destStart + length - 1,
          srcStart,
          srcEnd: srcStart + length - 1,
        }))
    );
    return { seeds, conversionMappings };
  };
  
  const lookupLocation = (conversionMappings: ConversionMap[][], val: number) => {
    return conversionMappings.reduce((curr, mappings) => {
      for (const m of mappings) {
        if (curr >= m.srcStart && curr <= m.srcEnd) {
          return m.destStart + (curr - m.srcStart);
        }
      }
      return curr;
    }, val);
  };
  
  const lookupSeed = (conversionMappings: ConversionMap[][], val: number) => {
    return conversionMappings.reduceRight((curr, mappings) => {
      for (const m of mappings) {
        if (curr >= m.destStart && curr <= m.destEnd) {
          return m.srcStart + (curr - m.destStart);
        }
      }
      return curr;
    }, val);
  };
  
  const partOne = (input: string) => {
    const { seeds, conversionMappings } = parseInput(input);
  
    const result = Math.min(
      ...seeds.map((seed) => lookupLocation(conversionMappings, seed))
    );
  
    console.log(`A-SIDE PUZZLE: ${result}`);
  };
  
  const partTwo = (input: string) => {
    const { seeds, conversionMappings } = parseInput(input);
    
    const validSeed = (seed: number) => {
      for (let i = 0; i < seeds.length; i += 2) {
        if (seed >= seeds[i] && seed < seeds[i] + seeds[i + 1]) {
          return true;
        }
      }
      return false;
    };
  
    const candidateSeeds = conversionMappings
      .flatMap((mappings, i) =>
        mappings.map((m) =>
          lookupSeed(conversionMappings.slice(0, i + 1), m.destStart)
        )
      )
      .filter(validSeed);
  
    const result = Math.min(
      ...candidateSeeds.map((s) => lookupLocation(conversionMappings, s))
    );
  
    console.log(`B-SIDE PUZZLE: ${result}`);
  };
  
  partOne(input);
  partTwo(input);