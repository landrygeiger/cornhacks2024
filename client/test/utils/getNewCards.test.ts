import { AppState, EncodedFrame } from "../../src/types";
import { getNewCards } from "../../src/utils";

describe("getNewCards", () => {
  it("returns only new cards", () => {
    const newData: EncodedFrame = {
      dealer: [
        { suit: "hearts", rank: "ace" },
        { suit: "spades", rank: 2 },
      ],
      player1: [
        [
          { suit: "spades", rank: 6 },
          { suit: "diamonds", rank: 7 },
          { suit: "clubs", rank: 8 },
          { suit: "hearts", rank: 9 },
          { suit: "spades", rank: 10 },
        ],
      ],
      player2: [
        [
          { suit: "hearts", rank: 8 },
          { suit: "spades", rank: 9 },
          { suit: "diamonds", rank: 10 },
          { suit: "clubs", rank: "jack" },
          { suit: "hearts", rank: "king" },
        ],
        [
          { suit: "spades", rank: "queen" },
          { suit: "diamonds", rank: "ace" },
          { suit: "clubs", rank: 2 },
          { suit: "hearts", rank: 3 },
          { suit: "spades", rank: 4 },
        ],
      ],
      player3: [[]],
    };

    const simulatedGameState: EncodedFrame = {
      dealer: [
        { suit: "hearts", rank: "ace" },
        { suit: "spades", rank: 2 },
      ],
      player1: [
        [
          { suit: "spades", rank: 6 },
          { suit: "diamonds", rank: 7 },
          { suit: "clubs", rank: 8 },
          { suit: "hearts", rank: 9 },
          { suit: "spades", rank: 10 },
        ],
      ],
      player2: [
        [
          { suit: "hearts", rank: 8 },
          { suit: "spades", rank: 9 },
          { suit: "diamonds", rank: 10 },
          { suit: "clubs", rank: "jack" },
          { suit: "hearts", rank: "king" },
        ],
      ],
      player3: [
        [
          { suit: "clubs", rank: 10 },
          { suit: "hearts", rank: "jack" },
        ],
      ],
    };

    const currAppState: AppState = {
      kind: "play",
      numDecks: 2,
      cardsSeen: [],
      simulatedGameState,
    };

    const expected = [
      { suit: "spades", rank: "queen" },
      { suit: "diamonds", rank: "ace" },
      { suit: "clubs", rank: 2 },
      { suit: "hearts", rank: 3 },
      { suit: "spades", rank: 4 },
    ];

    const result = getNewCards(newData)(currAppState);

    expect(result).toStrictEqual(expected);
  });
});
