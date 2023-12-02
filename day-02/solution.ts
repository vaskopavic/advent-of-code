// --- Day 2: Cube Conundrum ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

const partOne = (input: string) => {
    let result = 0;
    const map: Record<string, number> = { red: 12, green: 13, blue: 14 };
    const sequences = input.split("\n");

    sequences.forEach((sequence) => {
        const [key, value] = sequence.split(": ");

        const id = key.split(" ")[1];
        const rounds = value.split("; ");

        let isPossible = true;

        rounds.forEach((round) => {
            const set = round.split(", ");

            set.forEach((data) => {
                const [value, color] = data.split(" ");

                if (!(Number(value) <= map[color])) {
                    isPossible = false;
                }
            });
        });

        if (isPossible) {
            result += Number(id);
        }
    });

    console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
    let result = 0;
    const sequences = input.split("\n");

    sequences.forEach((sequence) => {
        let highestValues = [0, 0, 0];

        const rounds = sequence.split(": ")[1].split("; ");

        rounds.forEach((round) => {
            const cubes = round.split(",").map((item) => item.trim().split(" "));
            
            cubes.forEach(([countStr, color]) => {
                const count = Number(countStr);
                const index = { red: 0, green: 1, blue: 2 }[color];

                if (index !== undefined) {
                    highestValues[index] = Math.max(highestValues[index], count);
                }
            });
        });

        const power = highestValues.reduce((acc, value) => acc * value, 1);
        result += power;
    });

    console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);