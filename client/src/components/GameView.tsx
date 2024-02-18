import { FC } from "react";
import DealerHandView from "./DealerHandView";
import PlayerView from "./PlayerView";
import { HandWithPrescription } from "../types";

const p1Hand: HandWithPrescription[] = [
  {
    hand: [
      { suit: "diamonds", rank: "king" },
      { suit: "hearts", rank: 5 },
      { suit: "clubs", rank: "ace" },
      { suit: "diamonds", rank: 8 },
    ],
    prescription: "stand",
  },
  {
    hand: [
      { suit: "clubs", rank: "queen" },
      { suit: "diamonds", rank: "jack" },
    ],
    prescription: "hit",
  },
];

const p2Hand: HandWithPrescription[] = [
  {
    hand: [
      { suit: "hearts", rank: "ace" },
      { suit: "spades", rank: 8 },
    ],
    prescription: "double down",
  },
];

const p3Hand: HandWithPrescription[] = [
  {
    hand: [
      { suit: "diamonds", rank: 3 },
      { suit: "clubs", rank: "queen" },
      { suit: "hearts", rank: 9 },
    ],
    prescription: "split",
  },
];

const GameView: FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        position: "absolute",
        width: "100%",
        top: 0,
        bottom: 0,
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        margin: 0,
      }}
    >
      <div
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          flexGrow: 1,
          flexBasis: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex" }}>
          <DealerHandView hand={p1Hand[0].hand} />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexGrow: 1,
          flexBasis: 0,
          margin: 0,
        }}
      >
        <PlayerView hands={p1Hand} style={{ flexGrow: 1, flexBasis: 0 }} />
        <PlayerView hands={p2Hand} style={{ flexGrow: 1, flexBasis: 0 }} />
        <PlayerView hands={p3Hand} style={{ flexGrow: 1, flexBasis: 0 }} />
      </div>
    </div>
  );
};

export default GameView;
