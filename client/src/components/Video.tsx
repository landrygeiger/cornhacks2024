import "./video.css";

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
};

export const Video = ({ videoRef }: Props) => {
  return (
    <>
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
    </>
  );
};
