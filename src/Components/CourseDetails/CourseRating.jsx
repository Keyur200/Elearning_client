import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  LinearProgress, 
  Rating, 
  Avatar, 
  Stack, 
  Button, 
  TextField, 
  Divider 
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import Swal from "sweetalert2";

const CourseRating = ({ courseId, access, user }) => {
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [breakdown, setBreakdown] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
  
  // Form State
  const [myRating, setMyRating] = useState(0);
  const [myReview, setMyReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRatings();
    fetchAverage();
  }, [courseId]);

  // 1. Fetch All Ratings List
  const fetchRatings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/rating/course/${courseId}`);
      if (res.data.success) {
        setRatings(res.data.ratings);
        calculateBreakdown(res.data.ratings);
      }
    } catch (err) {
      console.error("Error fetching ratings", err);
    }
  };

  // 2. Fetch Average Stats
  const fetchAverage = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/rating/average/${courseId}`);
      if (res.data.success) {
        setAverage(res.data.average);
        setTotalRatings(res.data.totalRatings);
      }
    } catch (err) {
      console.error("Error fetching average", err);
    }
  };

  // 3. Calculate 5-star, 4-star distribution
  const calculateBreakdown = (ratingsList) => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    ratingsList.forEach((r) => {
      const rounded = Math.round(r.rating); // 4.5 -> 5
      if (counts[rounded] !== undefined) counts[rounded]++;
    });
    setBreakdown(counts);
  };

  // 4. Submit Rating
  const handleSubmit = async () => {
    if (myRating === 0) {
      Swal.fire("Error", "Please select a star rating", "error");
      return;
    }

    try {
      setSubmitting(true);
      const res = await axios.post(`http://localhost:5000/api/rating/${courseId}/${user._id}`, {
        rating: myRating,
        review: myReview
      });

      if (res.data.success) {
        Swal.fire("Success", res.data.message, "success");
        setMyRating(0);
        setMyReview("");
        fetchRatings(); // Refresh list
        fetchAverage(); // Refresh stats
      }
    } catch (err) {
      Swal.fire("Error", "Failed to submit rating", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 6, p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Student Feedback
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={6} mb={4}>
        {/* Left: Big Average Number */}
        <Box textAlign="center" minWidth="150px">
          <Typography variant="h2" fontWeight="bold" color="warning.main">
            {average.toFixed(1)}
          </Typography>
          <Rating value={average} precision={0.5} readOnly size="large" />
          <Typography variant="body2" color="text.secondary" mt={1}>
            Course Rating
          </Typography>
        </Box>

        {/* Right: Progress Bars */}
        <Box flexGrow={1}>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = breakdown[star] || 0;
            const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
            
            return (
              <Stack key={star} direction="row" alignItems="center" spacing={2} mb={1}>
                <LinearProgress 
                  variant="determinate" 
                  value={percentage} 
                  sx={{ 
                    flexGrow: 1, 
                    height: 8, 
                    borderRadius: 5, 
                    bgcolor: "#e0e0e0", 
                    "& .MuiLinearProgress-bar": { bgcolor: "warning.main" } 
                  }} 
                />
                <Stack direction="row" spacing={0.5} minWidth="60px">
                  <Rating value={star} max={star} readOnly size="small" />
                  <Typography variant="body2" color="text.secondary">
                    {percentage.toFixed(0)}%
                  </Typography>
                </Stack>
              </Stack>
            );
          })}
        </Box>
      </Stack>

      <Divider sx={{ mb: 4 }} />

      {/* Review Form (Only if Enrolled) */}
      {access ? (
        <Box mb={5} p={3} bgcolor="#f9f9f9" borderRadius={2}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Leave a Rating
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Typography component="legend">Rating</Typography>
              <Rating
                name="user-rating"
                value={myRating}
                onChange={(event, newValue) => setMyRating(newValue)}
                size="large"
              />
            </Box>
            <TextField
              label="Write your review..."
              multiline
              rows={3}
              variant="outlined"
              fullWidth
              value={myReview}
              onChange={(e) => setMyReview(e.target.value)}
            />
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleSubmit} 
              disabled={submitting}
              sx={{ width: "fit-content" }}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </Stack>
        </Box>
      ) : (
        <Box mb={5} p={2} bgcolor="#fff3cd" borderRadius={1}>
          <Typography variant="body2" color="text.primary">
            ⚠️ You must be enrolled in this course to leave a review.
          </Typography>
        </Box>
      )}

      {/* User Reviews List */}
      <Stack spacing={3}>
        {ratings.length > 0 ? (
          ratings.map((r) => (
            <Box key={r._id}>
              <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  {r.userId?.name?.charAt(0) || "U"}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold">
                    {r.userId?.name || "Unknown User"}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={r.rating} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              <Typography variant="body2" color="text.secondary" ml={7}>
                {r.review}
              </Typography>
              <Divider sx={{ mt: 2 }} />
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">No reviews yet.</Typography>
        )}
      </Stack>
    </Box>
  );
};

export default CourseRating;