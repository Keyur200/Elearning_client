import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
  Grid,
  CardMedia,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import LockIcon from "@mui/icons-material/Lock";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import PreviewVideoDialog from "../Components/PreviewVideoDialog";
import axios from "axios";
import { useAuth } from "../Context/UserContext";

const CourseDetails = () => {

  const [user, setUser] = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Preview video popup
  const [openPreview, setOpenPreview] = useState(false);
  const [previewVideos, setPreviewVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [access, setAccess] = useState(false);

  const checkAccess = async () => {
    const { data } = await axios.get(
      `http://localhost:5000/api/course/${id}/access`,
      { params: { userId: user._id } }
    );
    setAccess(data.access);
  };

  useEffect(() => {
    checkAccess();
  }, []);

  const getCourseDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/courses/details/${id}`, {
        method: "GET",
        credentials: "include", // Authentication with cookies
      });

      if (res.status === 401) {
        Swal.fire("Unauthorized", "Please login to view this course.", "error");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to load course details");

      const data = await res.json();
      setCourseData(data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourseDetails();
  }, [id]);

  // Popup preview handlers
  const handleOpenPreview = (videos, clickedIndex) => {
    const previews = videos.filter((v) => v.isPreview);
    const index = previews.findIndex((v) => v._id === videos[clickedIndex]._id);
    setPreviewVideos(previews);
    setCurrentIndex(index);
    setOpenPreview(true);
  };

  const handleClosePreview = () => setOpenPreview(false);
  const handleNext = () => setCurrentIndex((i) => Math.min(i + 1, previewVideos.length - 1));
  const handlePrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  if (loading) {
    return (
      <Box sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!courseData || !courseData.course) {
    return (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Course not found.
        </Typography>
      </Box>
    );
  }

  const { course, purchased, sections } = courseData;

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };
  const handleContinue = () => {
    navigate(`/my-course/${course._id}`);
  };

  const handleBuyNow = async () => {
    const res = await loadRazorpay();

    if (!res) {
      toast.error('Razorpay SDK failed to load');
      return;
    }
    try {
      const { data } = await axios.post("http://localhost:5000/api/createorder", {
        courseId: course._id,
        userId: user._id,
        amount: course.price
      });

      const options = {
        key: data.key,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "My Learning App",
        description: course.title,
        order_id: data.razorpayOrder.id,

        handler: async function (response) {
          await axios.post("http://localhost:5000/api/payment", {
            orderId: data.orderId,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          alert("Payment successful!");
          navigate(`/my-course/${course._id}`);
        },

        theme: {
          color: "#a435f0"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("🔥 FRONTEND ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };


  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* ===== Hero Section ===== */}
      <Box sx={{ backgroundColor: "#1c1d1f", color: "white", py: 8, px: { xs: 2, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left: Course Thumbnail */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ borderRadius: 2, overflow: "hidden", boxShadow: 5 }}>
              <CardMedia
                component="img"
                image={course.thumbnail}
                alt={course.title}
                sx={{
                  width: "100%",
                  height: { xs: 240, sm: 320, md: 380 },
                  objectFit: "cover",
                }}
              />
            </Paper>
          </Grid>

          {/* Right: Course Info */}
          <Grid item xs={12} md={7}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ mb: 2, lineHeight: 1.2, fontSize: { xs: "1.8rem", md: "2.4rem" } }}
            >
              {course.title}
            </Typography>

            <Typography variant="h6" color="#d1d7dc" sx={{ mb: 2 }}>
              {course.description}
            </Typography>

            <Typography color="#b5b5b5" sx={{ mb: 0.5 }}>
              Category: <strong>{course.categoryId?.name}</strong>
            </Typography>
            <Typography color="#b5b5b5" sx={{ mb: 0.5 }}>
              Instructor:{" "}
              <strong style={{ color: "#c0c4fc" }}>{course.instructorId?.name}</strong>
            </Typography>
            <Typography color="#b5b5b5" sx={{ mb: 3 }}>
              Level: {course.level}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="h4" fontWeight="bold">
                ₹{course.price}
              </Typography>
              {course.estimatedPrice > course.price && (
                <Typography
                  variant="body2"
                  sx={{
                    textDecoration: "line-through",
                    color: "#ccc",
                    mb: 2,
                  }}
                >
                  ₹{course.estimatedPrice}
                </Typography>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  backgroundColor: "#a435f0",
                  "&:hover": { backgroundColor: "#8710d8" },
                  borderRadius: 1.5,
                  py: 1.3,
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                  mt: 2,
                }}
                onClick={access ? handleContinue : handleBuyNow}
              >
                {access ? "Continue Learning" : "Buy Now"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ===== Course Details ===== */}
      <Container sx={{ py: 6 }}>
        {/* What You’ll Learn */}
        {course.benefits && course.benefits.length > 0 && (
          <Paper
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: 2,
              p: 4,
              mb: 6,
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              What you’ll learn
            </Typography>
            <Grid container spacing={1}>
              {course.benefits.map((b, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    ✅ {b}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {/* Tags */}
        {course.tags && course.tags.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tags
            </Typography>
            {course.tags.map((tag, i) => (
              <Chip
                key={i}
                label={tag}
                color="primary"
                variant="outlined"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Course Content Accordion */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Course Content
          </Typography>

          {sections && sections.length > 0 ? (
            sections.map((section) => (
              <Accordion key={section._id} sx={{ borderRadius: 2, mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {section.title}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List>
                    {section.videos.map((video, idx) => (
                      <ListItem key={video._id} sx={{ pl: 4 }}>
                        <ListItemIcon>
                          {video.isPreview ? (
                            <PlayCircleIcon color="primary" />
                          ) : (
                            <LockIcon color="disabled" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={video.title}
                          secondary={`Duration: ${video.duration} min${video.isPreview ? " (Preview)" : ""
                            }`}
                        />
                        {video.isPreview && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => handleOpenPreview(section.videos, idx)}
                          >
                            Watch
                          </Button>
                        )}
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            ))
          ) : (
            <Typography color="text.secondary">No course content available.</Typography>
          )}
        </Box>
      </Container>

      {/* ===== Preview Video Dialog ===== */}
      <PreviewVideoDialog
        open={openPreview}
        handleClose={handleClosePreview}
        previewVideos={previewVideos}
        currentIndex={currentIndex}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </Box>
  );
};

export default CourseDetails;
