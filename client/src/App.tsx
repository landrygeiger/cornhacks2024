import { useEffect, useRef, useState } from "react";
import { Video } from "./components/Video";
import { AppState } from "./types";
import { initialSetupState } from "./utils";
import GameView from "./components/GameView";
import DeckCountSelector from "./components/DeckCountSelector";

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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div
          style={{
            display: "inline-block",
            position: "relative",
            height: "100%",
            overflow: "hidden",
            backgroundColor: "white",
          }}
        >
          <Video videoRef={videoRef} />
          {appState.kind === "setup" ? (
            <DeckCountSelector appState={appState} setAppState={setAppState} />
          ) : (
            <GameView setAppState={setAppState} />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
