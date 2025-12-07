import React, { forwardRef } from "react";
import { Box, Typography, Stack } from "@mui/material";

// Use forwardRef so the parent (EnrolledCourses) can access this DOM element to print it
const Certificate = forwardRef(({ studentName, courseName, date }, ref) => {
  
  if (!courseName) return null;

  return (
    <Box
      ref={ref} // 🟢 Attach the ref here
      sx={{
        width: "1123px", // A4 Landscape width
        height: "794px", // A4 Landscape height
        bgcolor: "#fff",
        p: 8,
        boxShadow: 0, // No shadow for print
        position: "relative",
        border: "20px solid #1565c0",
        backgroundImage: "radial-gradient(circle, #fff 80%, #e3f2fd 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        boxSizing: "border-box"
      }}
    >
      {/* Decorative Corners */}
      <Box sx={{ position: "absolute", top: 20, left: 20, width: 100, height: 100, borderTop: "5px solid #FFD700", borderLeft: "5px solid #FFD700" }} />
      <Box sx={{ position: "absolute", bottom: 20, right: 20, width: 100, height: 100, borderBottom: "5px solid #FFD700", borderRight: "5px solid #FFD700" }} />

      {/* Header */}
      <Typography variant="h2" sx={{ fontFamily: "'Cinzel', serif", fontWeight: "bold", color: "#1565c0", mb: 2 }}>
        CERTIFICATE
      </Typography>
      <Typography variant="h5" sx={{ letterSpacing: 4, textTransform: "uppercase", color: "#555" }}>
        OF COMPLETION
      </Typography>

      <Box sx={{ my: 4, width: "60%", height: "2px", bgcolor: "#FFD700" }} />

      <Typography variant="h6" sx={{ color: "#777", mb: 2 }}>
        This is to certify that
      </Typography>

      {/* Student Name */}
      <Typography variant="h3" sx={{ fontFamily: "'Great Vibes', cursive", color: "#333", mb: 2 }}>
        {studentName}
      </Typography>

      <Typography variant="h6" sx={{ color: "#777", mb: 2 }}>
        has successfully completed the course
      </Typography>

      {/* Course Name */}
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1565c0", mb: 4, maxWidth: "80%" }}>
        {courseName}
      </Typography>

      {/* Footer: Date & Signature */}
      <Stack direction="row" justifyContent="space-between" sx={{ width: "80%", mt: 8 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ borderTop: "1px solid #333", px: 4, pt: 1 }}>
            {date}
          </Typography>
          <Typography variant="caption" color="text.secondary">Date</Typography>
        </Box>

        {/* Badge/Seal */}
        <Box sx={{ 
          width: 120, height: 120, bgcolor: "#FFD700", borderRadius: "50%", 
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)", color: "#fff", fontWeight: "bold"
        }}>
          <Typography variant="caption" sx={{ color: "#8B4513", fontWeight: "bold" }}>OFFICIAL<br/>SEAL</Typography>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body1" sx={{ borderTop: "1px solid #333", px: 4, pt: 1, fontFamily: "'Great Vibes', cursive", fontSize: "1.5rem" }}>
            MyLearningApp
          </Typography>
          <Typography variant="caption" color="text.secondary">Instructor Signature</Typography>
        </Box>
      </Stack>
    </Box>
  );
});

export default Certificate;