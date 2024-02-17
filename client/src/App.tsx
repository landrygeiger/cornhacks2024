import { useEffect, useRef } from "react";
import { Video } from "./Video";

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

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

  return <Video videoRef={videoRef} />;
};

export default App;
