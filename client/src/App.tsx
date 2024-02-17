import HandView from "./components/HandView";

const App = () => {
  return (
    <>
      <h1>Hello World!</h1>
      <HandView
        hand={[
          { suit: "diamonds", rank: "king" },
          { suit: "hearts", rank: 5 },
          { suit: "clubs", rank: "ace" },
          { suit: "diamonds", rank: 8 },
        ]}
      />
    </>
  );
};

export default App;
