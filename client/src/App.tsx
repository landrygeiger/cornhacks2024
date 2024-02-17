import { useEffect, useRef } from "react";

const App = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) console.log("sending");
      };

      mediaRecorder.start(100);
    });
  }, []);

  return <video ref={videoRef} style={{ width: "100%" }} autoPlay />;
};

export default App;
