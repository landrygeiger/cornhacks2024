import { Dispatch, FC, SetStateAction } from "react";
import DealerHandView from "./DealerHandView";
import PlayerView from "./PlayerView";
import { AppState, PlayAppState } from "../types";
import TrueCountView from "./TrueCountView";
import { Button } from "@mui/joy";
import { RestartAltOutlined } from "@mui/icons-material";
import {
  getTrueCount,
  initialSetupState,
  prescribeHand,
  simplifyRank,
} from "../utils";

type Props = {
  setAppState: Dispatch<SetStateAction<AppState>>;
  appState: PlayAppState;
};

const GameView: FC<Props> = ({ setAppState, appState }) => {
  const dealerUp =
    appState.simulatedGameState.dealer.length === 1 &&
    appState.simulatedGameState.dealer[0];
  const p1Hands = appState.simulatedGameState.player1.map(hand => ({
    prescription: dealerUp
      ? prescribeHand(
          hand,
          appState.numDecks,
          appState.cardsSeen,
          simplifyRank(dealerUp.rank),
        )
      : undefined,
    hand,
  }));
  const p2Hands = appState.simulatedGameState.player2.map(hand => ({
    prescription: dealerUp
      ? prescribeHand(
          hand,
          appState.numDecks,
          appState.cardsSeen,
          simplifyRank(dealerUp.rank),
        )
      : undefined,
    hand,
  }));
  const p3Hands = appState.simulatedGameState.player3.map(hand => ({
    prescription: dealerUp
      ? prescribeHand(
          hand,
          appState.numDecks,
          appState.cardsSeen,
          simplifyRank(dealerUp.rank),
        )
      : undefined,
    hand,
  }));

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
          flexGrow: 1,
          flexBasis: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignSelf: "stretch",
            margin: "0.5em 0.5em",
          }}
        >
          <TrueCountView
            trueCount={getTrueCount(appState.numDecks, appState.cardsSeen)}
            sx={{
              boxShadow: "0.2em 0.2em 0.2em rgba(0,0,0, .2)",
            }}
          />
          <Button
            size="sm"
            color="danger"
            variant="solid"
            startDecorator={<RestartAltOutlined fontSize="small" />}
            onClick={() => setAppState(initialSetupState)}
            sx={{
              boxShadow: "0.2em 0.2em 0.2em rgba(0,0,0, .2)",
            }}
          >
            Reset
          </Button>
        </div>
        <div style={{ display: "flex", flexGrow: 1 }}>
          <DealerHandView hand={appState.simulatedGameState.dealer} />
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
        <PlayerView hands={p1Hands} style={{ flexGrow: 1, flexBasis: 0 }} />
        <PlayerView hands={p2Hands} style={{ flexGrow: 1, flexBasis: 0 }} />
        <PlayerView hands={p3Hands} style={{ flexGrow: 1, flexBasis: 0 }} />
      </div>
    </div>
  );
};

export default GameView;
