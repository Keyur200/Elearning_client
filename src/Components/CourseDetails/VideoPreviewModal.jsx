import { PlayCircle, X } from "lucide-react";

const VideoPreviewModal = ({ isOpen, video, onClose, onNext, onPrev }) => {
  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 w-full max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-slate-700">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-yellow-400" />
            Now Previewing: {video.title}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video */}
        <div className="aspect-video bg-black">
          <iframe
            src={video.videoUrl}
            className="w-full h-full"
            allowFullScreen
          ></iframe>
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-800 flex justify-between">
          <button onClick={onPrev} className="text-sm px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700">
            Previous
          </button>
          <button onClick={onNext} className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPreviewModal;
