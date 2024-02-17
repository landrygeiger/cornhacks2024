import "./video.css";

export const Video = ({
  videoRef,
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
}) => {
  return (
    <div style={{ position: "relative", width: "fit-content" }}>
      <video
        ref={videoRef}
        style={{ width: "100%", display: "block" }}
        autoPlay
      />
      <div className="vertical-line-left"></div>
      <div className="vertical-line-right"></div>
      <div className="horizontal-line"></div>
    </div>
  );
};
