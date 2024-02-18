import { FC } from "react";
import DealerHandView from "./DealerHandView";
import HandView from "./HandView";
import { Hand } from "../types";
import { Card } from "@mui/joy";

const p1Hand: Hand[] = [
  [
    { suit: "diamonds", rank: "king" },
    { suit: "hearts", rank: 5 },
    { suit: "clubs", rank: "ace" },
    { suit: "diamonds", rank: 8 },
  ],
  [
    { suit: "clubs", rank: "queen" },
    { suit: "diamonds", rank: "jack" },
  ],
];

const p2Hand: Hand[] = [
  [
    { suit: "hearts", rank: "ace" },
    { suit: "spades", rank: 8 },
  ],
];

const p3Hand: Hand[] = [
  [
    { suit: "diamonds", rank: 3 },
    { suit: "clubs", rank: "queen" },
    { suit: "hearts", rank: 9 },
  ],
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
        <Card>Dealer</Card>
        <div style={{ display: "flex" }}>
          <DealerHandView hand={p1Hand[0]} />
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
        <HandView
          hands={p1Hand}
          style={{ flexGrow: 1, flexBasis: 0 }}
          playerNumber={1}
        />
        <HandView
          hands={p2Hand}
          style={{ flexGrow: 1, flexBasis: 0 }}
          playerNumber={2}
        />
        <HandView
          hands={p3Hand}
          style={{ flexGrow: 1, flexBasis: 0 }}
          playerNumber={3}
        />
      </div>
    </div>
  );
};

export default GameView;
