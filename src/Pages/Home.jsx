import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [visibleCount, setVisibleCount] = useState(3); // 👈 show 3 at a time
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getAllPublishedCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/published-courses");
      setCourses(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllPublishedCourses();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3); // 👈 show 3 more each click
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
        Published Courses
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" mt={10}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={4}>
            {courses.slice(0, visibleCount).map((course) => (
              <Grid item xs={12} sm={6} md={4} key={course._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    height: "100%",
                    maxWidth: 345,
                    minWidth: 300,  
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s, box-shadow 0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  {/* Image section */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%", // 16:9 aspect ratio
                      overflow: "hidden",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={course.thumbnail || "/default-course.jpg"}
                      alt={course.title}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                        "&:hover": {
                          transform: "scale(1.05)",
                        },
                      }}
                    />
                  </Box>

                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      gutterBottom
                      noWrap
                    >
                      {course.title}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        height: "45px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {course.description}
                    </Typography>

                    <Typography variant="subtitle1" color="primary" mt={2}>
                      ₹{course.price}
                    </Typography>

                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      sx={{
                        mt: 2,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: "bold",
                      }}
                      onClick={() => navigate(`/course/${course._id}`)}
                    >
                      View Course
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Load More Button */}
          {visibleCount < courses.length && (
            <Box textAlign="center" mt={5}>
              <Button
                variant="outlined"
                size="large"
                onClick={handleLoadMore}
                sx={{
                  borderRadius: 3,
                  px: 4,
                  textTransform: "none",
                  fontWeight: "bold",
                }}
              >
                Load More
              </Button>
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Home;
