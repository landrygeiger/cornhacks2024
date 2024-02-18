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

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        if (!videoRef.current) return;
        videoRef.current.srcObject = stream;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        ws.onmessage = e => {
          console.log(e);
          // setAppState(assimilateUpdatedState(e.data));
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
            canvas.toBlob(blob => ws.send(blob!), "image/jpeg");
          }
        };
        setTimeout(() => {
          canvas.width = videoRef.current?.videoWidth!;
          canvas.height = videoRef.current?.videoHeight!;
          ctx?.drawImage(videoRef.current!, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(blob => {
            ws.send(blob!);
          }, "image/jpeg");
        }, 2000);

        // const mediaRecorder = new MediaRecorder(stream);
        // mediaRecorder.ondataavailable = e => {
        //   if (e.data.size > 0 && appState.kind === "play") {
        //     e.data.arrayBuffer().then(x => ws.send(x));
        //   }
        // };

        // mediaRecorder.start(100);
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
            <GameView setAppState={setAppState} />
          )}
        </div>
      </div>
    </>
  );
};

export default App;
