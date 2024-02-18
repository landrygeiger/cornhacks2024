export type Suit = "hearts" | "spades" | "diamonds" | "clubs";

// prettier-ignore
export type Rank = "ace" | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | "jack" | "king" | "queen";
export type SimplifiedRank = "ace" | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | "ten";

export type Card = {
  suit: Suit;
  rank: Rank;
};

export type Hand = Card[];

export type EncodedFrame = {
  dealer: Hand;
  player1: Hand[];
  player2: Hand[];
  player3: Hand[];
};

type SimulatedGameState = EncodedFrame;

export type AppState =
  | { kind: "setup"; numDecks: number }
  | {
      kind: "play";
      numDecks: number;
      cardsSeen: Card[];
      simulatedGameState: SimulatedGameState;
    };
