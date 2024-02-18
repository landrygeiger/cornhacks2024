import { Dispatch, SetStateAction } from "react";
import { AppState, Card, EncodedFrame } from "./types";

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

const getNewCards =
  (newData: EncodedFrame) =>
  (currAppState: AppState): Card[] => {
    throw null;
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
