import React, { useEffect, useState, useCallback } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Divider,
  Box,
  Stack,
  Button,
  TextField,
  MenuItem,
  InputAdornment,
  Modal,
  Card,
  CardMedia,
  Grid,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PublishIcon from "@mui/icons-material/Publish";
import UnpublishedIcon from "@mui/icons-material/DoNotDisturbOn";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function MyCourses() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/mycourses", {
        credentials: "include",
      });

      if (res.status === 401) {
        Swal.fire("Unauthorized", "Please login to access this page.", "error");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch courses");

      const data = await res.json();
      setCourses(data.courses || []);
      setFiltered(data.courses || []);
      if (!data.courses || data.courses.length === 0)
        setMessage("No courses found.");
    } catch (err) {
      setMessage(err.message || "Error fetching courses");
    }
  };

  // Search & Sort
  const handleSearchSort = useCallback(() => {
    let temp = [...courses];
    if (searchTerm) {
      temp = temp.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (sortKey === "title") {
      temp.sort((a, b) => a.title.localeCompare(b.title));
    }
    setFiltered(temp);
    setPage(0);
  }, [courses, searchTerm, sortKey]);

  useEffect(() => handleSearchSort(), [handleSearchSort]);

  const handleChangePage = (e, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // Publish / Unpublish course
  const togglePublish = async (course) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/coursepublish/${course._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublished: !course.isPublished }),
        }
      );

      if (res.status === 401) {
        Swal.fire("Unauthorized", "Please login again.", "error");
        navigate("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to update course");

      const data = await res.json();
      setCourses((prev) =>
        prev.map((c) => (c._id === course._id ? data.course : c))
      );
      Swal.fire(
        "Success",
        `Course ${course.isPublished ? "unpublished" : "published"} successfully`,
        "success"
      );
    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong", "error");
    }
  };

  // Open course modal
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCourse(null);
  };

  return (
    <Paper sx={{ width: "98%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Courses
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Search & Sort */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        <TextField
          label="Search by title"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          label="Sort by"
          size="small"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="title">Title (A-Z)</MenuItem>
        </TextField>

        <Box sx={{ flexGrow: 1 }} />
        <Button
          variant="contained"
          endIcon={<AddCircleIcon />}
          onClick={() => navigate("/instructor/create-course")}
        >
          Add Course
        </Button>
      </Stack>

      {message && <Typography color="error">{message}</Typography>}

      {/* Courses Table */}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Published</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((c, i) => (
                  <TableRow key={c._id}>
                    <TableCell>{page * rowsPerPage + i + 1}</TableCell>
                    <TableCell>{c.title}</TableCell>
                    <TableCell>{c.categoryId?.name || "N/A"}</TableCell>
                    <TableCell>₹{c.price}</TableCell>
                    <TableCell>{c.isPublished ? "Yes" : "No"}</TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1 }}
                        onClick={() => handleViewCourse(c)}
                      >
                        View
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color={c.isPublished ? "warning" : "success"}
                        startIcon={
                          c.isPublished ? <UnpublishedIcon /> : <PublishIcon />
                        }
                        onClick={() => togglePublish(c)}
                      >
                        {c.isPublished ? "Unpublish" : "Publish"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Course Details Modal */}
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
          {selectedCourse && (
            <>
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
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
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
                  <Typography variant="subtitle2" sx={{ mb: 2 }}>
                    Published: {selectedCourse.isPublished ? "Yes" : "No"}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

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
            </>
          )}
        </Box>
      </Modal>
    </Paper>
  );
}
