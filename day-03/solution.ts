// --- Day 3: Gear Ratios ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

interface Num {
    num: number;
    line: number;
    start: number;
    end: number;
}

interface Sym {
    sym?: string;
    line: number;
    idx: number;
}

const partOne = (input: string) => {
    const numbers: Num[] = [];
    const symbols: Sym[] = [];
    const lines = input.split("\n");

    for (const [lineIdx, line] of lines.entries()) {
        let numStr = "";
        let numStart = -1;

        for (const [charIdx, char] of [...line, "."].entries()) {
            if (char >= "0" && char <= "9") {
                if (numStart < 0) numStart = +charIdx;
                numStr += char;
            } else {
                if (numStr) {
                    numbers.push({
                        num: +numStr,
                        line: +lineIdx,
                        start: numStart,
                        end: +charIdx - 1
                    });
                    numStr = "";
                    numStart = -1;
                }

                if (char !== ".") {
                    symbols.push({
                        line: +lineIdx,
                        idx: +charIdx
                    });
                }
            }
        }
    }

    const partNumbers = numbers.filter(n =>
        symbols.some(s => s.idx >= n.start - 1 && s.idx <= n.end + 1 && [n.line - 1, n.line, n.line + 1].includes(s.line))
    );

    const sum = partNumbers.reduce((acc, { num }) => acc + num, 0);

    console.log(`A-SIDE PUZZLE: ${sum}`);
};

const partTwo = (input: string) => {
    const numbers: Num[] = [];
    const symbols: Sym[] = [];
    const gearRatios: number[] = [];
    const lines = input.split("\n");

    for (const [lineIdx, line] of lines.entries()) {
        let numStr = "";
        let numStart = -1;

        for (const [charIdx, char] of [...line, "."].entries()) {
            if (char >= "0" && char <= "9") {
                if (numStart < 0) numStart = +charIdx;
                numStr += char;
            } else {
                if (numStr) {
                    numbers.push({
                        num: +numStr,
                        line: +lineIdx,
                        start: numStart,
                        end: +charIdx - 1
                    });
                    numStr = "";
                    numStart = -1;
                }

                if (char !== ".") {
                    symbols.push({
                        sym: char,
                        line: +lineIdx,
                        idx: +charIdx
                    });
                }
            }
        }
    }

    symbols.forEach(s => {
        if (s.sym === "*") {
            const adjNumbers = numbers.filter(n =>
                (s.idx >= n.start - 1 && s.idx <= n.end + 1) &&
                (s.line === n.line || s.line === n.line - 1 || s.line === n.line + 1)
            );

            if (adjNumbers.length === 2) {
                gearRatios.push(adjNumbers[0].num * adjNumbers[1].num);
            }
        }
    });

    const sum = gearRatios.reduce((acc, ratio) => acc + ratio, 0);

    console.log(`B-SIDE PUZZLE: ${sum}`);
};

partOne(input);
partTwo(input);