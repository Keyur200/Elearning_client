import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, Loader2, Maximize, Volume2 } from "lucide-react";

const formatTime = (time) => {
  if (!time) return "00:00";
  const hrs = Math.floor(time / 3600);
  const mins = Math.floor((time % 3600) / 60);
  const secs = Math.floor(time % 60);
  if (hrs > 0) return `${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const VideoPlayer = ({ video, onComplete }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setIsPlaying(false);
    setLoading(true);
    setCurrentTime(0);
    setDuration(0);
  }, [video]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) videoRef.current.pause();
    else videoRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedData = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
    setLoading(false);
  };

  const handleProgressClick = (e) => {
    if (!videoRef.current) return;
    const rect = e.target.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  if (!video) return (
    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-slate-400">
      <Play size={48} className="mb-4 opacity-50" />
      <p className="font-medium">Select a lesson to start learning</p>
    </div>
  );

  return (
    <div className="relative w-full h-full bg-black group overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/10">
          <Loader2 className="animate-spin w-12 h-12 text-indigo-500" />
        </div>
      )}

      <video
        ref={videoRef}
        src={video.videoUrl || video.url}
        onEnded={onComplete}
        onLoadedData={handleLoadedData}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-contain"
        onClick={togglePlay}
      />

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-4 z-30">
        <button onClick={togglePlay} className="text-white hover:text-indigo-400 transition-colors">
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
        </button>

        {/* Progress Bar */}
        <div
          className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressClick}
        >
          <div
            className="h-full bg-indigo-500 relative"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md" />
          </div>
        </div>

        <div className="flex items-center gap-3 text-white text-xs font-medium">
          <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
          <button className="hover:text-indigo-400"><Volume2 size={20} /></button>
          <button className="hover:text-indigo-400"><Maximize size={20} /></button>
        </div>
      </div>

      {/* Big Play Button */}
      {!isPlaying && !loading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-all hover:scale-110">
            <Play size={32} className="text-white ml-1" fill="white" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
