import "./video.css";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

export const Video = ({ videoRef }: Props) => {
  return (
    <div style={{ position: "relative", width: "300px" }}>
      <video
        ref={videoRef}
        style={{ width: "100%", display: "block" }}
        playsInline
        autoPlay
        muted
      />
      <div className="vertical-line-left"></div>
      <div className="vertical-line-right"></div>
      <div className="horizontal-line"></div>
    </div>
  );
};
