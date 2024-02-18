import { Dispatch, SetStateAction } from "react";
import { AppState, Card, EncodedFrame, PlayAppState } from "./types";
import { flow, pipe } from "fp-ts/lib/function";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";

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
