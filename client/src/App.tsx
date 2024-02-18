import { useEffect, useRef, useState } from "react";
import { Video } from "./components/Video";
import { AppState } from "./types";
import { assimilateUpdatedState, initialSetupState } from "./utils";
import GameView from "./components/GameView";
import DeckCountSelector from "./components/DeckCountSelector";

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [appState, setAppState] = useState<AppState>(initialSetupState);

  useEffect(() => {
    // const ws = new WebSocket("ws://184.105.6.45:4444");
    const ws = new WebSocket("ws://184.105.6.45:4444");
    ws.onmessage = e => {
      console.log(e);
      setAppState(assimilateUpdatedState(e.data));
    };

    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 3840 },
          height: { ideal: 2160 },
        },
      })
      .then(stream => {
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        setInterval(() => {
          canvas.width = videoRef.current?.videoWidth!;
          canvas.height = videoRef.current?.videoHeight!;
          if (
            videoRef.current?.readyState === videoRef.current?.HAVE_ENOUGH_DATA
          ) {
            ctx?.drawImage(
              videoRef.current!,
              0,
              0,
              canvas.width,
              canvas.height,
            );
            canvas.toBlob(blob => {
              console.log("ws sent", blob);
              return ws.send(blob!);
            }, "image/jpeg");
          }
        }, 1000);
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
            backgroundColor: "white",
          }}
        >
          <Video videoRef={videoRef} />
          {appState.kind === "setup" ? (
            <DeckCountSelector appState={appState} setAppState={setAppState} />
          ) : (
            <GameView appState={appState} setAppState={setAppState} />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
