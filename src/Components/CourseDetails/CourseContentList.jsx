import { Clock, PlayCircle, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const CourseContentList = ({ sections, handleOpenPreview }) => {
  const [open, setOpen] = useState(0);

  return (
    <div className="mt-10">
      <h3 className="text-2xl font-bold mb-6">Course Content</h3>

      {sections?.map((section, idx) => (
        <div key={section._id} className="border rounded-xl shadow-sm mb-4">
          <button
            className="w-full flex justify-between items-center p-5 text-lg font-semibold"
            onClick={() => setOpen(open === idx ? -1 : idx)}
          >
            {section.title}
            {open === idx ? <ChevronUp /> : <ChevronDown />}
          </button>

          {open === idx && (
            <div>
              {section.videos.map((video, vIdx) => (
                <div key={video._id} className="flex justify-between items-center p-4 border-t">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${video.isPreview ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      {video.isPreview ? <PlayCircle /> : <Lock />}
                    </div>
                    <div>
                      <p className="font-medium">{video.title}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {video.duration} min
                      </p>
                    </div>
                  </div>

                  {video.isPreview ? (
                    <button
                      onClick={() => handleOpenPreview(section.videos, vIdx)}
                      className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-full"
                    >
                      Preview
                    </button>
                  ) : (
                    <p className="text-xs text-slate-400">Locked</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CourseContentList;
