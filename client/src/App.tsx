import HandView from "./components/HandView";
import { Hand } from "./types";

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

const App = () => {
  return (
    <>
      {" "}
      <h1>Hello World!</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          height: "15vh",
        }}
      >
        <HandView hand={p1Hand} style={{ flexGrow: 1 }} />
        <HandView
          hand={p2Hand}
          style={{ flexGrow: 1, alignSelf: "flex-end" }}
        />
        <HandView hand={p3Hand} style={{ flexGrow: 1 }} />
      </div>
    </>
  );
};

export default App;
