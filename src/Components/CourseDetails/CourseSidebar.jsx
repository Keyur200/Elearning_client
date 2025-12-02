import { Clock, BookOpen, Globe, Award, CheckCircle, Play } from "lucide-react";
import { useState, useEffect } from "react";

const CourseSidebar = ({
  course,
  access,
  onBuyNow,
  onContinue,
  totalDuration,
  totalSections,
  totalVideos,
}) => {
  const [playPreview, setPlayPreview] = useState(false);
  const [previewVideo, setPreviewVideo] = useState(null);

  // Find first preview video from all sections
  useEffect(() => {
    if (course?.sections?.length) {
      const firstPreviewVideo = course.sections
        .flatMap((section) => section.videos)
        .find((video) => video.isPreview && video.videoUrl);

      if (firstPreviewVideo) setPreviewVideo(firstPreviewVideo);
    }
  }, [course]);

  console.log("Preview Video:", previewVideo);

  return (
    <div className="lg:w-96 mt-8 lg:mt-0">
      <div className="bg-white rounded-2xl shadow-xl sticky top-24 border">

        {/* Preview / Thumbnail */}
        <div
          className="relative h-48 group cursor-pointer rounded-t-2xl overflow-hidden"
          onClick={() => setPlayPreview(true)}
        >
          {previewVideo && playPreview ? (
            <video
              key={previewVideo._id} // ensures reload if changed
              src={previewVideo.videoUrl}
              className="h-full w-full object-cover"
              controls
              autoPlay
              muted
              preload="metadata"
            />
          ) : (
            <>
              <img
                src={course.thumbnail}
                alt="Course Thumbnail"
                className="h-full w-full object-cover"
              />
              {previewVideo && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-10 h-10 text-white" />
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar Content */}
        <div className="p-8">
          {!access ? (
            <>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-4xl font-extrabold">₹{course.price}</span>
              </div>
              <button
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold"
                onClick={onBuyNow}
              >
                Buy Now
              </button>
            </>
          ) : (
            <div>
              <div className="bg-green-100 text-green-700 p-4 rounded-xl mb-6 flex flex-col items-center">
                <CheckCircle className="w-8 h-8" />
                <span className="font-bold">You own this course</span>
              </div>
              <button
                className="w-full bg-indigo-600 text-white py-4 rounded-xl"
                onClick={onContinue}
              >
                Continue Learning
              </button>
            </div>
          )}

          <div className="mt-8 space-y-4">
            <p className="font-bold mb-4">Course Details:</p>
            {course.categoryId && (
              <div className="flex justify-between border-b pb-3">
                <span>Category</span>
                <span>{course.categoryId.name}</span>
              </div>
            )}

            <div className="flex justify-between border-b pb-3">
              <span className="flex items-center gap-2"><Clock /> Duration</span>
              <span>{totalDuration || "0m"}</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="flex items-center gap-2"><BookOpen /> Lessons</span>
              <span>{totalVideos || 0}</span>
            </div>

            <div className="flex justify-between border-b pb-3">
              <span className="flex items-center gap-2"><Globe /> Language</span>
              <span>English</span>
            </div>

            <div className="flex justify-between">
              <span className="flex items-center gap-2"><Award /> Certificate</span>
              <span>Yes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
