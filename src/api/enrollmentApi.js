import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// Get enrolled course details
export const getEnrolledCourse = async (courseId) => {
  const { data } = await axios.get(`${API_BASE}/course/${courseId}/enrolled`, {
    withCredentials: true, // send cookies for authentication
  });
  return data;
};

// Add a new comment/review
export const addVideoReview = async (videoId, comment) => {
  const { data } = await axios.post(
    `${API_BASE}/video/${videoId}/review`,
    { comment },
    { withCredentials: true }
  );
  return data;
};

// Reply to a review (instructor)
export const replyToReview = async (reviewId, reply) => {
  const { data } = await axios.post(
    `${API_BASE}/review/${reviewId}/reply`,
    { reply },
    { withCredentials: true }
  );
  return data;
};

// Check if user has access to course
export const checkCourseAccess = async (courseId) => {
  const { data } = await axios.get(`${API_BASE}/course/${courseId}/access`, {
    withCredentials: true,
  });
  return data.access;
};

/**
 * -------------------------------
 * Mark video as complete & update progress
 * -------------------------------
 */
export const markVideoComplete = async (videoId) => {
  const { data } = await axios.post(
    `${API_BASE}/video/${videoId}/complete`, // backend route
    {},
    { withCredentials: true }
  );
  return data; // should return updated progress object
};
