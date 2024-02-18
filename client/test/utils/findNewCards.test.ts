import { Card } from "../../src/types";
import { findNewCards } from "../../src/utils";

describe("findNewCards", () => {
  it("removes cards already seen", () => {
    const currCards: Card[] = [
      { suit: "hearts", rank: 2 },
      { suit: "clubs", rank: "king" },
      { suit: "diamonds", rank: "ace" },
      { suit: "diamonds", rank: 4 },
    ];

    const oldCards: Card[] = [
      { suit: "clubs", rank: "king" },
      { suit: "diamonds", rank: "ace" },
    ];

    const expected: Card[] = [
      { suit: "hearts", rank: 2 },
      { suit: "diamonds", rank: 4 },
    ];

    const result = findNewCards(currCards)(oldCards);

    expect(result).toStrictEqual(expected);
  });
});
