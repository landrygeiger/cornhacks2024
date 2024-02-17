import { useEffect, useRef, useState } from "react";
import { Video } from "./Video";
import { AppState } from "./types";
import {
  incrementNumDecksBy,
  initialPlayState,
  initialSetupState,
} from "./utils";

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

  return appState.kind === "setup" ? (
    <div>
      <Video videoRef={videoRef} />
      <button onClick={() => incrementNumDecksBy(setAppState)(1)}>+</button>
      <div>{appState.numDecks}</div>
      <button onClick={() => incrementNumDecksBy(setAppState)(-1)}>-</button>
      <button onClick={() => setAppState(initialPlayState(appState.numDecks))}>
        start
      </button>
    </div>
  ) : (
    <div>
      <Video videoRef={videoRef} />
      <button onClick={() => setAppState(initialSetupState)}>reset</button>
    </div>
  );
};

export default App;
