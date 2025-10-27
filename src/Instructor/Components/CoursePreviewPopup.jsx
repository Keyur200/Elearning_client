import React from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  Divider,
  Card,
  CardMedia,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const CourseDetailsPopup = ({ open, handleClose, selectedCourse }) => {
  const navigate = useNavigate();

  if (!selectedCourse) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: 700 },
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Top Section: Thumbnail + Basic Info */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card sx={{ borderRadius: 2 }}>
              <CardMedia
                component="img"
                image={selectedCourse.thumbnail || "/default-course.jpg"}
                alt={selectedCourse.title}
                sx={{ height: 200, objectFit: "cover" }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {selectedCourse.title}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
              {selectedCourse.description}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Category: {selectedCourse.categoryId?.name || "N/A"}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Level: {selectedCourse.level || "Beginner"}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Price: ₹{selectedCourse.price}
            </Typography>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Published: {selectedCourse.isPublished ? "Yes" : "No"}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        {/* ✅ Course Statistics Section */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Course Summary
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            🧩 Total Sections: <strong>{selectedCourse.totalSections || 0}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 0.5 }}>
            🎞️ Total Videos: <strong>{selectedCourse.totalVideos || 0}</strong>
          </Typography>
          <Typography variant="body2">
            ⏱️ Total Duration: <strong>{selectedCourse.totalDuration || "0m"}</strong>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Benefits Section */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Benefits
        </Typography>
        <ul>
          {(Array.isArray(selectedCourse.benefits)
            ? selectedCourse.benefits
            : typeof selectedCourse.benefits === "string"
            ? selectedCourse.benefits.split(",")
            : []
          ).map((b, i) => (
            <li key={i}>
              <Typography variant="body2">{b}</Typography>
            </li>
          ))}
        </ul>

        <Divider sx={{ my: 2 }} />

        {/* Buttons */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="flex-end"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              navigate(`/instructor/edit-course/${selectedCourse._id}`)
            }
          >
            Edit Course Details
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() =>
              navigate(`/instructor/edit-videos/${selectedCourse._id}`)
            }
          >
            Edit Course Videos
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default CourseDetailsPopup;
