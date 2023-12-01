// --- Day 1: Trebuchet?! ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

const partOne = (input: string) => {
    let result = 0;
    const sequences = input.split("\n");

    sequences.forEach((sequence) => {
        const validNumbers = sequence.split("").filter((char) => !isNaN(parseInt(char)));
        const usableNumber = parseInt(`${validNumbers.at(0)}${validNumbers.at(-1)}}`);

        result += usableNumber;
    })

    console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
    const map: Record<string, string> = {
        one: "1",
        two: "2",
        three: "3",
        four: "4",
        five: "5",
        six: "6",
        seven: "7",
        eight: "8",
        nine: "9",
    };

    const extractDigit = (characters: string[], startIndex: number, direction: number): string => {
        let digit = "0";

        for (let i = startIndex; i >= 0 && i < characters.length; i += direction) {
            const character = characters[i];

            if (!isNaN(parseInt(character))) {
                digit = character;
                break;
            }

            Object.entries(map).forEach(([wordNumber, digitValue]) => {
                const possibleNumberWord = characters.slice(i, i + wordNumber.length).join("");

                if (possibleNumberWord === wordNumber) {
                    digit = digitValue;
                }
            });

            if (digit !== "0") {
                break;
            }
        }

        return digit;
    };

    let result = 0;
    const sequences = input.split("\n");

    sequences.forEach((sequence) => {
        const characters = sequence.split("");
        const firstNumber = extractDigit(characters, 0, 1);
        const secondNumber = extractDigit(characters, characters.length - 1, -1);

        const usableNumber = parseInt(`${firstNumber}${secondNumber}`);

        result += usableNumber;
    });

    console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);