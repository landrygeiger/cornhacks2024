import { FC } from "react";
import DealerHandView from "./DealerHandView";
import HandView from "./HandView";
import { Hand } from "../types";

const p1Hand: Hand = [
  { suit: "diamonds", rank: "king" },
  { suit: "hearts", rank: 5 },
  { suit: "clubs", rank: "ace" },
  { suit: "diamonds", rank: 8 },
];

const p2Hand: Hand = [
  { suit: "hearts", rank: "ace" },
  { suit: "spades", rank: 8 },
];

const p3Hand: Hand = [
  { suit: "diamonds", rank: 3 },
  { suit: "clubs", rank: "queen" },
  { suit: "hearts", rank: 9 },
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
      <DealerHandView
        hand={p1Hand}
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          flexGrow: 1,
          flexBasis: 0,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          flexGrow: 1,
          flexBasis: 0,
          margin: 0,
        }}
      >
        <HandView hand={p1Hand} style={{ flexGrow: 1 }} />
        <HandView hand={p2Hand} style={{ flexGrow: 1, marginTop: "10vh" }} />
        <HandView hand={p3Hand} style={{ flexGrow: 1 }} />
      </div>
    </div>
  );
};

export default GameView;
