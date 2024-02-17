import "./video.css";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

export const Video = ({ videoRef }: Props) => {
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          height: "100vh",
        }}
      >
        <video
          ref={videoRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            opacity: "25%",
          }}
          playsInline
          autoPlay
          muted
        />
        <div className="vertical-line-left"></div>
        <div className="vertical-line-right"></div>
        <div className="horizontal-line"></div>
      </div>
    </div>
  );
};
