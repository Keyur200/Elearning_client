import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Typography,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Rating,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from "@mui/material";
import { PlayCircle, EmojiEvents } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Import the Certificate Component (Make sure this file exists in src/Pages/)
import Certificate from "./Certificate"; 

export default function EnrolledCourses({ userProfile }) {
  // --- State Variables ---
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [ratings, setRatings] = useState({}); // Map: { courseId: 4.5 }
  
  // --- Certificate Generation State ---
  const [certData, setCertData] = useState(null); // Data for the hidden certificate
  const certificateRef = useRef(null); // Ref to capture the hidden certificate

  // --- Dialog State ---
  const [openDialog, setOpenDialog] = useState(false);
  const [certName, setCertName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const navigate = useNavigate();

  // --- 1. Fetch Data on Mount ---
  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/my/enrollments", {
        withCredentials: true,
      });
      
      const enrolledData = res.data.enrolledCourses || [];
      setCourses(enrolledData);

      // Fetch average rating for each course
      enrolledData.forEach((item) => {
        if (item.courseId?._id) fetchCourseRating(item.courseId._id);
      });

    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseRating = async (courseId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/rating/average/${courseId}`);
      if (res.data.success) {
        setRatings((prev) => ({ ...prev, [courseId]: res.data.average }));
      }
    } catch (err) {
      console.error(`Failed to fetch rating for ${courseId}`);
    }
  };

  // --- 2. Certificate Logic ---

  // Step A: User clicks "Get Certificate" -> Open Dialog
  const handleOpenCertDialog = (course) => {
    setSelectedCourse(course);
    // Pre-fill with the profile name, or fallback to "Student"
    setCertName(userProfile?.fullName || "Student Name"); 
    setOpenDialog(true);
  };

  // Step B: User clicks "Download" in Dialog -> Generate PDF
  const generateCertificate = async () => {
    setOpenDialog(false); // Close UI

    if (!selectedCourse) return;

    // 1. Set data to trigger hidden render
    setCertData({
      studentName: certName,
      courseName: selectedCourse.courseId?.title,
      date: new Date().toLocaleDateString()
    });

    // 2. Wait for React to render the hidden component, then capture
    setTimeout(async () => {
      if (certificateRef.current) {
        try {
          const canvas = await html2canvas(certificateRef.current, { scale: 2 });
          const imgData = canvas.toDataURL("image/png");
          
          // Create PDF (Landscape A4)
          const pdf = new jsPDF("landscape", "px", "a4");
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${selectedCourse.courseId?.title}_Certificate.pdf`);
        } catch (error) {
          console.error("Certificate generation failed", error);
        } finally {
          // Cleanup
          setCertData(null); 
          setSelectedCourse(null);
        }
      }
    }, 500); // 500ms delay ensures DOM is ready
  };

  // --- 3. Render ---
  return (
    <>
      <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
        My Enrolled Courses
      </Typography>
      <Divider sx={{ mb: 3 }} />

      {/* 🟢 HIDDEN CERTIFICATE TEMPLATE (Off-screen) */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
        {certData && (
          <Certificate 
            ref={certificateRef}
            studentName={certData.studentName}
            courseName={certData.courseName}
            date={certData.date}
          />
        )}
      </div>

      {/* 🟢 NAME CONFIRMATION DIALOG */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Certificate Details</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the name you would like to appear on your official certificate.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name on Certificate"
            type="text"
            fullWidth
            variant="outlined"
            value={certName}
            onChange={(e) => setCertName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={generateCertificate} 
            variant="contained" 
            color="primary" 
            disabled={!certName.trim()}
          >
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>

      {/* 🟢 MAIN TABLE CONTENT */}
      {loading ? (
        <Box textAlign="center" py={5}>
          <CircularProgress />
        </Box>
      ) : courses.length === 0 ? (
        <Box textAlign="center" py={5}>
          <Typography color="text.secondary">
            You haven't purchased any courses yet.
          </Typography>
          <Button
            variant="outlined"
            sx={{ mt: 2 }}
            onClick={() => navigate("/all-courses")}
          >
            Browse Courses
          </Button>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0" }}>
          <Table sx={{ minWidth: 700 }} aria-label="enrolled courses table">
            <TableHead sx={{ bgcolor: "#f9fafb" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Thumbnail</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Course Details</TableCell>
                <TableCell sx={{ fontWeight: "bold", width: "25%" }}>Progress</TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.map((en) => {
                const isCompleted = en.progress === 100;
                const ratingValue = ratings[en.courseId?._id] || 0;

                return (
                  <TableRow
                    key={en._id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    {/* 1. Thumbnail */}
                    <TableCell component="th" scope="row">
                      <Box
                        component="img"
                        src={en.courseId?.thumbnail || "https://via.placeholder.com/150"}
                        alt={en.courseId?.title}
                        sx={{
                          width: 120,
                          height: 70,
                          objectFit: "cover",
                          borderRadius: 2,
                          boxShadow: 1
                        }}
                      />
                    </TableCell>

                    {/* 2. Course Details (Title, Level, Rating) */}
                    <TableCell>
                      <Typography variant="subtitle1" fontWeight={600} sx={{ lineHeight: 1.2, mb: 0.5 }}>
                        {en.courseId?.title}
                      </Typography>
                      
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Chip 
                          label={en.courseId?.level || "General"} 
                          size="small" 
                          sx={{ height: 20, fontSize: "0.7rem", bgcolor: "#e3f2fd", color: "#1565c0" }} 
                        />
                        
                        <Box display="flex" alignItems="center">
                          <Rating value={ratingValue} precision={0.5} readOnly size="small" />
                          <Typography variant="caption" sx={{ ml: 0.5, color: "text.secondary", fontWeight: "bold" }}>
                            {ratingValue > 0 ? ratingValue.toFixed(1) : "New"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* 3. Progress Bar */}
                    <TableCell>
                      <Box display="flex" justifyContent="space-between" mb={0.5}>
                        <Typography variant="caption" color="text.secondary" fontWeight="bold">
                          {isCompleted ? "Completed" : "In Progress"}
                        </Typography>
                        <Typography variant="caption" fontWeight="bold">
                          {en.progress || 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={en.progress || 0}
                        color={isCompleted ? "success" : "primary"}
                        sx={{ height: 8, borderRadius: 5 }}
                      />
                    </TableCell>

                    {/* 4. Action Buttons */}
                    <TableCell align="right">
                      <Stack direction="column" spacing={1} alignItems="flex-end">
                        
                        {/* Continue/Start Button */}
                        <Button
                          variant={isCompleted ? "outlined" : "contained"}
                          size="small"
                          color="primary"
                          startIcon={<PlayCircle />}
                          onClick={() => navigate(`/enrolled-course/${en.courseId._id}`)}
                          sx={{ textTransform: "none", minWidth: 150 }}
                        >
                          {en.progress > 0 ? "Continue" : "Start Learning"}
                        </Button>

                        {/* Download Certificate Button (Visible only if 100%) */}
                        {isCompleted && (
                          <Button
                            variant="contained"
                            size="small"
                            color="success"
                            startIcon={<EmojiEvents />}
                            onClick={() => handleOpenCertDialog(en)}
                            sx={{ 
                              textTransform: "none", 
                              minWidth: 150,
                              bgcolor: "#2e7d32",
                              "&:hover": { bgcolor: "#1b5e20" }
                            }}
                          >
                            Get Certificate
                          </Button>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}