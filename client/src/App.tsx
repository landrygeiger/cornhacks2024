import { useEffect, useRef, useState } from "react";
import { Video } from "./components/Video";
import { AppState } from "./types";
import {
  incrementNumDecksBy,
  initialPlayState,
  initialSetupState,
} from "./utils";
import GameView from "./components/GameView";

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [appState, setAppState] = useState<AppState>(initialSetupState);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4444");
    ws.onmessage = console.log;

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;

        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = e => {
          if (e.data.size > 0) {
            e.data.arrayBuffer().then(x => ws.send(x));
          }
        };

        mediaRecorder.start(100);
      });
  }, []);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "inline-block",
            position: "relative",
            height: "100vh",
          }}
        >
          <Video videoRef={videoRef} />
          {appState.kind === "setup" ? (
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
              <button onClick={() => incrementNumDecksBy(setAppState)(1)}>
                +
              </button>
              <div>{appState.numDecks}</div>
              <button onClick={() => incrementNumDecksBy(setAppState)(-1)}>
                -
              </button>
              <button
                onClick={() => setAppState(initialPlayState(appState.numDecks))}
              >
                start
              </button>
            </div>
          ) : (
            <GameView />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
