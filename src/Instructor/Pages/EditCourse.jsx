import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const EditCourse = () => {
  const { courseId } = useParams(); // <-- use the correct param name
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [course, setCourse] = useState({
    title: "",
    description: "",
    categoryId: "",
    price: "",
    estimatedPrice: "",
    tags: "",
    level: "Beginner",
    benefits: "",
    thumbnail: "",
  });

  // Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories", { withCredentials: true })
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  // Fetch existing course data
  useEffect(() => {
    if (!courseId) {
      setError("Course ID is missing in URL.");
      setLoading(false);
      return;
    }

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/course/${courseId}`,
          { withCredentials: true }
        );

        const data = res.data;

        setCourse({
          title: data.title || "",
          description: data.description || "",
          categoryId: data.categoryId?._id || "",
          price: data.price || "",
          estimatedPrice: data.estimatedPrice || "",
          tags: Array.isArray(data.tags) ? data.tags.join(",") : data.tags || "",
          level: data.level || "Beginner",
          benefits: Array.isArray(data.benefits)
            ? data.benefits.join(",")
            : data.benefits || "",
          thumbnail: data.thumbnail || "",
        });

        setPreviewUrl(data.thumbnail || null);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching course:", err.response || err);
        setError(
          err.response?.data?.message || "Failed to load course details."
        );
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourse({ ...course, [name]: value });
  };

  // Handle thumbnail file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.title || !course.categoryId || !course.price) {
      Swal.fire("Error", "Title, Category, and Price are required.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("categoryId", course.categoryId);
      formData.append("price", course.price);
      formData.append("estimatedPrice", course.estimatedPrice);
      formData.append("level", course.level);
      formData.append("tags", course.tags);
      formData.append("benefits", course.benefits);
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile);

      await axios.put(`http://localhost:5000/api/course/${courseId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      Swal.fire("Success", "Course updated successfully!", "success");
      navigate(`/instructor/edit-videos/${courseId}`);
    } catch (err) {
      console.error("Error updating course:", err.response || err);
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  // Loading or error display
  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl font-medium">Loading course details...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600 text-xl font-medium">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-md"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Course
        </h2>

        {/* Title & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              name="categoryId"
              value={course.categoryId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price & Estimated Price */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-2 font-medium">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={course.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Estimated Price (₹)</label>
            <input
              type="number"
              name="estimatedPrice"
              value={course.estimatedPrice}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Level & Thumbnail */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block mb-2 font-medium">Level</label>
            <select
              name="level"
              value={course.level}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Change Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
            {previewUrl && (
              <div className="mt-4">
                <img
                  src={previewUrl}
                  alt="Thumbnail Preview"
                  className="w-64 h-40 object-cover rounded-md border"
                />
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mt-4">
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            rows="3"
          />
        </div>

        {/* Tags & Benefits */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              value={course.tags}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block mb-2 font-medium">Benefits (comma separated)</label>
            <input
              type="text"
              name="benefits"
              value={course.benefits}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Update Course
        </button>
      </form>
    </div>
  );
};

export default EditCourse;
