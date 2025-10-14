import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const CreateCourse = () => {
  const navigate = useNavigate();

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
  });

  // Fetch categories
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/categories", { withCredentials: true })
      .then((res) => setCategories(res.data))
      .catch((err) =>
        console.error("Error fetching categories:", err.response || err)
      );
  }, []);

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

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!course.title || !course.categoryId || !course.price) {
      Swal.fire("Error", "Title, Category, and Price are required.", "error");
      return;
    }

    if (!thumbnailFile) {
      Swal.fire("Error", "Thumbnail is required.", "error");
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
      formData.append("tags", course.tags); // comma-separated
      formData.append("benefits", course.benefits); // comma-separated
      formData.append("thumbnail", thumbnailFile);

      const res = await axios.post(
        "http://localhost:5000/api/course",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true, // Send JWT cookie for authentication
        }
      );

      Swal.fire("Success", "Course created successfully!", "success");

      // Redirect to Add Video page
      navigate(`/instructor/add-video/${res.data.course._id}`);
    } catch (err) {
      console.error(
        "Error creating course:",
        err.response?.data || err.message || err
      );
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-md"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Create New Course
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
              placeholder="Enter course title"
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
              placeholder="Enter course price"
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
              placeholder="Enter estimated price"
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
            <label className="block mb-2 font-medium">Upload Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 rounded-md p-2"
              required
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
            placeholder="Enter description"
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
              placeholder="e.g. javascript,frontend,programming"
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
              placeholder="e.g. Learn basics, Build projects"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default CreateCourse;
