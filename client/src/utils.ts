import { Dispatch, SetStateAction } from "react";
import { AppState } from "./types";

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
