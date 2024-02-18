import { Dispatch, SetStateAction } from "react";
import {
  AppState,
  Card,
  EncodedFrame,
  Hand,
  PlayAppState,
  Prescription,
  Rank,
  SimplifiedRank,
} from "./types";
import { flow, pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as M from "fp-ts/Monoid";
import * as N from "fp-ts/number";
import { P, match } from "ts-pattern";

export const initialPlayState = (numDecks: number): AppState => ({
  kind: "play",
  numDecks,
  cardsSeen: [],
  simulatedGameState: {
    dealer: [],
    player1: [],
    player2: [],
    player3: [],
  },
});

export const initialSetupState: AppState = { kind: "setup", numDecks: 1 };

export const incrementNumDecksBy =
  (setState: Dispatch<SetStateAction<AppState>>) => (count: number) =>
    setState(s =>
      s.kind === "setup" && s.numDecks + count > 0
        ? { ...s, numDecks: s.numDecks + count }
        : s,
    );

const stabilize = (frame: EncodedFrame): EncodedFrame => {
  return frame;
};

export const getCards = (data: EncodedFrame) =>
  pipe(
    data.dealer,
    A.concat(A.flatten(data.player1)),
    A.concat(A.flatten(data.player2)),
    A.concat(A.flatten(data.player3)),
  );

const indexOfCard = (card: Card) =>
  flow(
    A.findIndex(
      (otherCard: Card) =>
        card.rank === otherCard.rank && card.suit === otherCard.suit,
    ),
    O.toUndefined,
  );

const removeOneCardInstance = (card: Card) => (cards: Card[]) => {
  const i = indexOfCard(card)(cards);
  return i !== undefined ? cards.slice(0, i).concat(cards.slice(i + 1)) : cards;
};

export const findNewCards =
  (cardsToCheck: Card[]) =>
  (currCards: Card[]): Card[] => {
    console.log(cardsToCheck, currCards);
    if (currCards.length === 0) {
      return cardsToCheck;
    }

    return findNewCards(removeOneCardInstance(currCards[0])(cardsToCheck))(
      currCards.slice(1),
    );
  };

export const getNewCards =
  (newData: EncodedFrame) =>
  (currAppState: PlayAppState): Card[] => {
    const newDataCards = getCards(newData);
    const currSimulatedCards = getCards(currAppState.simulatedGameState);

    return findNewCards(newDataCards)(currSimulatedCards);
  };

export const assimilateUpdatedState =
  (newData: EncodedFrame) =>
  (currAppState: AppState): AppState => {
    if (currAppState.kind === "setup") return currAppState;
    const stabilizedUpdate = stabilize(newData);
    const newCards = getNewCards(stabilizedUpdate)(currAppState);
    const newAppState: AppState = {
      kind: "play",
      cardsSeen: [...currAppState.cardsSeen, ...newCards],
      numDecks: currAppState.numDecks,
      simulatedGameState: stabilizedUpdate,
    };
    return newAppState;
  };

const rankToValue = (aceHigh: boolean) => (rank: Rank) =>
  match(rank)
    .with(P.number, x => x)
    .with("ace", () => (aceHigh ? 11 : 1))
    .with(P.string, () => 10)
    .exhaustive();

const simplifyRank = (rank: Rank): SimplifiedRank =>
  match(rank)
    .with(10, "jack", "king", "queen", () => "ten" as const)
    .with(P.number, x => x)
    .with("ace", () => "ace" as const)
    .exhaustive();

const pairOf = (rank: SimplifiedRank) => (hand: Hand) =>
  hand.length == 2 &&
  hand[0] === hand[1] &&
  simplifyRank(hand[0].rank) === rank;

const totalOf = (total: number) => (hand: Hand) =>
  M.concatAll(N.MonoidSum)(hand.map(x => x.rank).map(rankToValue(true))) ===
  total;

const test =
  (
    playerHandMatches: (hand: Hand) => boolean,
    expectedDealerUp: SimplifiedRank,
    index: number,
  ) =>
  (value: readonly [Hand, SimplifiedRank, number]) =>
    playerHandMatches(value[0]) &&
    expectedDealerUp === value[1] &&
    value[2] >= index;

const i18 =
  (tc: number) =>
  (playerHand: Hand) =>
  (dealerUp: SimplifiedRank): Prescription | null =>
    match([playerHand, dealerUp, tc])
      .when(test(totalOf(16), "ten", 0), () => "stand" as const)
      .when(test(totalOf(15), "ten", 4), () => "stand" as const)
      .when(test(pairOf("ten"), 5, 5), () => "split" as const)
      .when(test(pairOf("ten"), 6, 4), () => "split" as const)
      .when(test(totalOf(10), "ten", 4), () => "double/hit" as const)
      .when(test(totalOf(12), 3, 2), () => "stand" as const)
      .when(test(totalOf(12), 4, 3), () => "stand" as const)
      .when(test(totalOf(11), "ace", 1), () => "double/hit" as const)
      .when(test(totalOf(9), 2, 1), () => "double/hit" as const)
      .when(test(totalOf(10), "ace", 4), () => "double/hit" as const)
      .when(test(totalOf(9), 7, 3), () => "double/hit" as const)
      .when(test(totalOf(16), 9, 5), () => "stand" as const)
      .when(test(totalOf(13), 2, -1), () => "stand" as const)
      .when(test(totalOf(12), 4, 0), () => "stand" as const)
      .when(test(totalOf(12), 5, -2), () => "stand" as const)
      .when(test(totalOf(12), 6, -1), () => "stand" as const)
      .when(test(totalOf(13), 3, -2), () => "stand" as const)
      .otherwise(() => null);

const simpRankToCol = (rank: SimplifiedRank) =>
  rank === "ten" ? 8 : rank === "ace" ? 9 : rank - 2;

const hardTotal = (total: number, dealerTotal: SimplifiedRank) =>
  match(total)
    .when(
      x => x <= 8,
      // prettier-ignore
      () => ["hit", "hit", "hit", "hit", "hit", "hit", "hit", "hit", "hit", "hit"],
    )
    .with(
      9,
      // prettier-ignore
      () => ["hit", "double/hit", "double/hit", "double/hit", "double/hit", "hit", "hit", "hit", "hit", "hit"],
    )
    .with(
      10,
      // prettier-ignore
      () => ["double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "hit", "hit"],
    )
    .with(
      11,
      // prettier-ignore
      () => ["double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "hit"],
    )
    .with(
      12,
      // prettier-ignore
      () => ["hit", "hit", "stand", "stand", "stand", "hit", "hit", "hit", "hit", "hit"],
    )
    .when(
      x => x <= 16 && x >= 13,
      // prettier-ignore
      () => ["stand", "stand", "stand", "stand", "stand", "hit", "hit", "hit", "hit", "hit"],
    )
    .when(
      x => x >= 17,
      // prettier-ignore
      () => ["stand", "stand", "stand", "stand", "stand", "stand", "stand", "stand", "stand", "stand"],
    )
    .run()[simpRankToCol(dealerTotal)] as Prescription;

const softTotal = (withAce: number, dealerTotal: SimplifiedRank) =>
  match(withAce)
    .with(
      2,
      3,
      // prettier-ignore
      () => ["hit", "hit", "hit", "double/hit", "double/hit", "hit", "hit", "hit", "hit", "hit"],
    )
    .with(
      4,
      5,
      // prettier-ignore
      () => ["hit", "hit", "double/hit", "double/hit", "double/hit", "hit", "hit", "hit", "hit", "hit"],
    )
    .with(
      6,
      // prettier-ignore
      () => ["hit", "double/hit", "double/hit", "double/hit", "double/hit", "hit", "hit", "hit", "hit", "hit"],
    )
    .with(
      7,
      // prettier-ignore
      () => ["stand", "double/stand", "double/stand", "double/stand", "double/stand", "stand", "stand", "hit", "hit", "hit"],
    )
    .when(
      x => x >= 8,
      // prettier-ignore
      () => ["stand", "stand", "stand", "stand", "stand", "stand", "stand", "stand", "stand", "stand"],
    )
    .run()[simpRankToCol(dealerTotal)] as Prescription;

const pairs = (pairOf: SimplifiedRank, dealerTotal: SimplifiedRank) =>
  match(pairOf)
    .with(
      2,
      3,
      // prettier-ignore
      () => ["split", "split", "split", "split", "split", "split", "hit", "hit", "hit", "hit"],
    )
    .with(
      4,
      // prettier-ignore
      () => ["hit", "hit", "hit", "split", "split", "hit", "hit", "hit", "hit", "hit"],
    )
    .with(
      5,
      // prettier-ignore
      () => ["double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "double/hit", "hit", "hit"],
    )
    .with(
      6,
      // prettier-ignore
      () => ["split", "split", "split", "split", "split", "hit", "hit", "hit", "hit", "hit"],
    )
    .with(
      7,
      // prettier-ignore
      () => ["split", "split", "split", "split", "split", "split", "hit", "hit", "hit", "hit"],
    )
    .with(
      8,
      // prettier-ignore
      () => ["split", "split", "split", "split", "split", "split", "split", "split", "split", "split"],
    )
    .with(
      9,
      // prettier-ignore
      () => ["split", "split", "split", "split", "split", "stand", "split", "split", "stand", "stand"],
    )
    .with(
      "ten",
      // prettier-ignore
      () => ["stand", "stand", "stand", "stand", "stand", "stand", "stand", "stand", "stand", "stand"],
    )
    .with(
      "ace",
      // prettier-ignore
      () => ["split", "split", "split", "split", "split", "split", "split", "split", "split", "split"],
    )
    .run()[simpRankToCol(dealerTotal)] as Prescription;

const cardToCountVal = (card: Card) =>
  match(card.rank)
    .with(2, 3, 4, 5, 6, () => 1)
    .with(7, 8, 9, () => 0)
    .with(10, "jack", "queen", "king", "ace", () => -1)
    .exhaustive();

function getSoftHand(hand: Hand): number | null {
  let total = 0;
  let aceCount = 0;

  // Map ranks to their values
  const rankValues: { [rank in Rank]: number } = {
    ace: 1, // Treat Ace as 1 initially
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    jack: 10,
    queen: 10,
    king: 10,
  };

  // Calculate initial sum and count Aces
  hand.forEach(card => {
    if (card.rank === "ace") {
      aceCount += 1;
    } else {
      total += rankValues[card.rank];
    }
  });

  // Check if adding 10 for an Ace makes it a soft hand without exceeding 21
  if (aceCount > 0 && total + 10 + aceCount - 1 <= 21) {
    // Return the "x" value excluding one Ace counted as 11, others as 1
    return total + aceCount - 1; // Subtracting 1 because one Ace is counted as 11, not 1
  }

  return null; // No soft Ace in hand
}

const prescribeHand = (
  hand: Hand,
  numDecks: number,
  cardsSeen: Card[],
  dealerUp: SimplifiedRank,
): Prescription => {
  const numDecksLeft = (numDecks * 52 - cardsSeen.length) / 52;
  const rc = M.concatAll(N.MonoidSum)(cardsSeen.map(cardToCountVal));
  const tc = rc / numDecksLeft;
  const i18Presc = i18(tc)(hand)(dealerUp);
  if (i18Presc) return i18Presc;
  const isPair = hand.length === 2 && hand[0] === hand[1];
  if (isPair) return pairs(simplifyRank(hand[0].rank), dealerUp);
  const withAce = getSoftHand(hand);
  if (withAce) return softTotal(withAce, dealerUp);
  const hardTotalPresc = hardTotal(
    M.concatAll(N.MonoidSum)(hand.map(x => x.rank).map(rankToValue(false))),
    dealerUp,
  );
  return hardTotalPresc;
};
