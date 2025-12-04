import React, { useRef, useState } from "react";

const VideoPlayer = ({ video, onComplete, onNext }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    // can show progress bar later if needed
  };

  const handleLoadedData = () => {
    // You can auto-play if needed
  };

  return (
    <div className="w-full h-full bg-black">
      <video
        ref={videoRef}
        src={video?.videoUrl || video?.url}
        className="w-full h-full object-contain"
        onClick={togglePlay}
        onLoadedData={handleLoadedData}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          onComplete?.(video);    // ← calls API
          onNext?.();             // ← auto next video
        }}
        controls
      />
    </div>
  );
};

export default VideoPlayer;
