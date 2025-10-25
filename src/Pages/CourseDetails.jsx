import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  Divider,
  Card,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import { FaUserGraduate, FaCheckCircle } from "react-icons/fa";
import StarIcon from "@mui/icons-material/Star";

const CourseDetails = () => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const getCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/course/${id}`);
      console.log("Fetched course data:", res.data);

      setCourse(res.data);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCourse();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          height: "70vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return (
      <Box sx={{ textAlign: "center", py: 5 }}>
        <Typography variant="h6" color="text.secondary">
          Course not found.
        </Typography>
      </Box>
    );
  }

  // ✅ Instructor data fix
  const instructorName =
    course.instructorId?.name ||
    course.instructor?.name ||
    "Instructor Name";

  const benefitsList = Array.isArray(course.benefits)
    ? course.benefits
    : typeof course.benefits === "string"
    ? course.benefits
        .replace(/\r?\n/g, ",")
        .split(",")
        .map((b) => b.trim())
        .filter((b) => b.length > 0)
    : [];

  const tagsList = Array.isArray(course.tags)
    ? course.tags
    : typeof course.tags === "string"
    ? course.tags.split(",").map((t) => t.trim())
    : [];

  return (
    <Box sx={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundColor: "#1c1d1f",
          color: "white",
          py: 6,
          px: { xs: 2, md: 10 },
        }}
      >
        <Grid container spacing={4} alignItems="flex-start">
          {/* ✅ Left side - Thumbnail / Video */}
          <Grid item xs={12} md={5}>
            <Card
              sx={{
                backgroundColor: "#000",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 6,
              }}
            >
              <CardMedia
                component="img"
                image={course.thumbnail || "/default-course.jpg"}
                alt={course.title}
                sx={{
                  height: { xs: 240, md: 300 },
                  objectFit: "cover",
                }}
              />
              <Box sx={{ p: 2, backgroundColor: "#111" }}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => navigate(`/enroll/${course._id}`)}
                  sx={{
                    backgroundColor: "#a435f0",
                    "&:hover": { backgroundColor: "#8710d8" },
                    borderRadius: 1.5,
                    py: 1.2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Buy Now
                </Button>
                <Typography
                  variant="body2"
                  color="#ccc"
                  sx={{ mt: 1, textAlign: "center" }}
                >
                  30-Day Money-Back Guarantee
                </Typography>
              </Box>
            </Card>
          </Grid>

          {/* ✅ Right side - Course Info */}
          <Grid item xs={12} md={7}>
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ mb: 2, lineHeight: 1.2 }}
            >
              {course.title}
            </Typography>

            <Typography variant="h6" color="#d1d7dc" sx={{ mb: 2 }}>
              {course.description?.slice(0, 200) || ""}
            </Typography>

            <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
              <Typography
                variant="subtitle1"
                sx={{ color: "#f5c518", fontWeight: 600, mr: 1 }}
              >
                4.8
              </Typography>
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} sx={{ color: "#f5c518", fontSize: 20 }} />
              ))}
              <Typography variant="body2" sx={{ ml: 1 }}>
                (1,240 ratings) • 5,600 students
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <FaUserGraduate style={{ marginRight: 8 }} />
              <Typography variant="subtitle2">
                Created by{" "}
                <span style={{ color: "#c0c4fc" }}>{instructorName}</span>
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="#d1d7dc">
                Level: {course.level || "Beginner"}
              </Typography>
              <Typography variant="body2" color="#d1d7dc">
                Last updated: {new Date(course.createdAt).toLocaleDateString()}
              </Typography>
            </Box>

            <Box sx={{ mt: 3 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: "#fff", mb: 1 }}
              >
                ₹{course.price}
              </Typography>
              {course.estimatedPrice &&
                course.estimatedPrice > course.price && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textDecoration: "line-through", color: "#ccc" }}
                  >
                    ₹{course.estimatedPrice}
                  </Typography>
                )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content */}
      <Container sx={{ py: 6 }}>
        {/* What You’ll Learn Section */}
        {benefitsList.length > 0 && (
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              boxShadow: 2,
              p: 4,
              mb: 6,
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              What you'll learn
            </Typography>
            <Grid container spacing={1}>
              {benefitsList.map((benefit, i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <List disablePadding>
                    <ListItem disableGutters>
                      <ListItemIcon>
                        <FaCheckCircle style={{ color: "#2d8659" }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1">{benefit}</Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Tags */}
        {tagsList.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Tags
            </Typography>
            {tagsList.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                variant="outlined"
                color="primary"
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        )}

        <Divider sx={{ my: 4 }} />

        {/* Instructor Section */}
        <Box>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Instructor
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <FaUserGraduate size={40} color="#1976d2" />
            <Box>
              <Typography variant="h6" fontWeight={600}>
                {instructorName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expert Instructor in {course.category?.name || "Technology"}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CourseDetails;
