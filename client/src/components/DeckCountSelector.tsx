import { Dispatch, FC, SetStateAction } from "react";
import { AppState } from "../types";
import { incrementNumDecksBy, initialPlayState } from "../utils";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import Stack from "@mui/joy/Stack";
import Box from "@mui/joy/Box";

type Props = {
  appState: AppState;
  setAppState: Dispatch<SetStateAction<AppState>>;
};

const DeckCountSelector: FC<Props> = ({ appState, setAppState }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50%",
        width: "100%",
      }}
    >
      <Card
        sx={{
          minWidth: "25em",
          gap: "1.25em",
          boxShadow: "0.2em 0.2em 0.2em rgba(0,0,0, .2)",
        }}
      >
        <Typography level="h3">Black Jack Optimal</Typography>
        <Typography>How many decks will you be playing with?</Typography>
        <Stack direction="row" alignItems="center" gap={"1em"}>
          <Button
            variant="outlined"
            disabled={appState.numDecks === 1}
            onClick={() => incrementNumDecksBy(setAppState)(-1)}
          >
            -
          </Button>
          <Typography>{appState.numDecks}</Typography>
          <Button
            variant="outlined"
            onClick={() => incrementNumDecksBy(setAppState)(1)}
          >
            +
          </Button>
          <Box flexGrow={1}>
            <Button
              onClick={() => setAppState(initialPlayState(appState.numDecks))}
              sx={{ marginLeft: "auto", display: "block" }}
            >
              Start
            </Button>
          </Box>
        </Stack>
      </Card>
    </div>
  );
};

export default DeckCountSelector;
