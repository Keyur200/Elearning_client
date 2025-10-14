import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const AddVideo = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [videos, setVideos] = useState([]); // Local video list before upload

  const [courseTitle, setCourseTitle] = useState("");

  // Fetch course info for display
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/course/${courseId}`, {
        withCredentials: true,
      })
      .then((res) => setCourseTitle(res.data.title))
      .catch((err) => console.error(err.response || err));
  }, [courseId]);

  // Handle adding a new video
  const handleAddVideo = () => {
    setVideos([
      ...videos,
      { title: "", description: "", file: null, url: "", order: videos.length + 1, isPreview: false },
    ]);
  };

  // Handle input change for video
  const handleChange = (index, field, value) => {
    const updated = [...videos];
    updated[index][field] = value;
    setVideos(updated);
  };

  // Handle file selection
  const handleFileChange = (index, file) => {
    const updated = [...videos];
    updated[index].file = file;
    updated[index].url = "";
    setVideos(updated);
  };

  // Remove a video
  const handleRemove = (index) => {
    const updated = [...videos];
    updated.splice(index, 1);
    // Reorder after removal
    updated.forEach((v, i) => (v.order = i + 1));
    setVideos(updated);
  };

  // Move video up
  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...videos];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updated.forEach((v, i) => (v.order = i + 1));
    setVideos(updated);
  };

  // Move video down
  const moveDown = (index) => {
    if (index === videos.length - 1) return;
    const updated = [...videos];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    updated.forEach((v, i) => (v.order = i + 1));
    setVideos(updated);
  };

  // Handle submit all videos
  const handleSubmit = async () => {
    if (videos.length === 0) {
      Swal.fire("Error", "Add at least one video before uploading", "error");
      return;
    }

    try {
      for (const video of videos) {
        const formData = new FormData();
        formData.append("title", video.title);
        formData.append("description", video.description);
        formData.append("courseId", courseId);
        formData.append("order", video.order);
        formData.append("isPreview", video.isPreview);
        if (video.file) {
          formData.append("video", video.file);
        } else if (video.url) {
          formData.append("videoUrl", video.url);
        } else {
          Swal.fire("Error", `Video ${video.order} has no file or URL`, "error");
          return;
        }

        await axios.post("http://localhost:5000/api/video", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });
      }

      Swal.fire("Success", "All videos uploaded successfully!", "success");
      navigate(`/instructor/preview-course/${courseId}`);
    } catch (err) {
      console.error(err.response || err);
      Swal.fire("Error", err.response?.data?.message || "Upload failed", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-bold mb-6">Add Videos to "{courseTitle}"</h2>

      {videos.map((video, index) => (
        <div
          key={index}
          className="bg-white p-4 rounded-xl shadow-md mb-4 relative"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Video {video.order}</h3>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => moveUp(index)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => moveDown(index)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-medium">Title</label>
              <input
                type="text"
                value={video.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <input
                type="text"
                value={video.description}
                onChange={(e) => handleChange(index, "description", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          <div className="mt-2">
            <label className="block mb-1 font-medium">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileChange(index, e.target.files[0])}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            <span className="text-gray-500 text-sm">Or enter a video URL below:</span>
            <input
              type="text"
              value={video.url}
              onChange={(e) => handleChange(index, "url", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 mt-1"
              placeholder="https://..."
            />
            <div className="mt-1 text-sm text-gray-400">
              Current order: {video.order}
            </div>
          </div>
        </div>
      ))}

      <div className="flex space-x-4 mt-4">
        <button
          type="button"
          onClick={handleAddVideo}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Add Another Video
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload All Videos
        </button>
      </div>
    </div>
  );
};

export default AddVideo;
