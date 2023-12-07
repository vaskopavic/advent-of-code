// --- Day 7: Camel Cards ---

const path = "./input.txt";
const file = Bun.file(path);
const input = await file.text();

interface Hand {
  equal: number[];
  cards: string;
  bid: number;
}

const standardCardOrder = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "T",
  "J",
  "Q",
  "K",
  "A",
];
const jokerCardOrder = ["J", ...standardCardOrder];

const parseInput = (input: string): Hand[] => {
  return input.split("\n").map((line) => {
    const equal = [...new Set(line.split(" ")[0].split(""))]
      .map(
        (card) => (line.split(" ")[0].match(new RegExp(card, "g")) || []).length
      )
      .filter((amount) => amount > 1)
      .sort((a, b) => b - a);

    return {
      equal,
      cards: line.split(" ")[0],
      bid: +line.split(" ")[1],
    };
  });
};

const compareHands = (a: Hand, b: Hand, useJoker = false) => {
  const cardOrder = useJoker ? jokerCardOrder : standardCardOrder;

  if (getType(a.equal) === getType(b.equal)) {
    let result = 0;
    a.cards.split("").some((card, i) => {
      if (card !== b.cards.split("")[i]) {
        result =
          cardOrder.indexOf(card) - cardOrder.indexOf(b.cards.split("")[i]);
        return true;
      }
    });
    return result;
  }

  return getType(a.equal) - getType(b.equal);
};

const getType = (equalCards: number[]) => {
  switch (equalCards[0]) {
    case 5:
      return 6;
    case 4:
      return 5;
    case 3:
      return equalCards.length > 1 ? 4 : 3;
    case 2:
      return equalCards.length > 1 ? 2 : 1;
    default:
      return 0;
  }
};

const partOne = (input: string) => {
  const hands = parseInput(input);
  hands.sort((a, b) => compareHands(a, b));

  const result = hands.reduce((acc, curr, i) => (acc += curr.bid * ++i), 0);

  console.log(`A-SIDE PUZZLE: ${result}`);
};

const partTwo = (input: string) => {
  const hands = parseInput(input);

  hands.forEach((hand) => {
    const jokers = (hand.cards.match(new RegExp("J", "g")) || []).length;
    if (
      jokers > 0 &&
      hand.equal[0] &&
      (hand.equal[0] !== jokers || hand.equal.length > 1)
    ) {
      hand.equal[0] += jokers;
    } else if (jokers === 1) {
      hand.equal.push(jokers + 1);
    } else if (jokers === hand.equal[0]) {
      hand.equal[0] += 1;
    }
    hand.equal[0] = Math.min(5, hand.equal[0]);
  });
  hands.sort((a, b) => compareHands(a, b, true));

  const result = hands.reduce((acc, curr, i) => (acc += curr.bid * ++i), 0);

  console.log(`B-SIDE PUZZLE: ${result}`);
};

partOne(input);
partTwo(input);
