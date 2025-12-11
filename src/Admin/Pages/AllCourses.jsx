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
} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import UnpublishedIcon from "@mui/icons-material/DoNotDisturbOn";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Swal from "sweetalert2";
import axios from "axios";
import CourseDetailsPopup from "../Components/CoursePreviewPopup.jsx";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [message, setMessage] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses", {
        withCredentials: true,
      });
      const data = res.data;
      setCourses(data.courses || []);
      setFiltered(data.courses || []);
      if (!data.courses?.length) setMessage("No courses found.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error fetching courses");
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter and sort
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

  // Publish / Unpublish a course
  const togglePublish = async (course) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/course/publish/${course._id}`,
        { isPublished: !course.isPublished },
        { withCredentials: true }
      );

      Swal.fire(
        "Success",
        `Course ${course.isPublished ? "unpublished" : "published"} successfully`,
        "success"
      );

      // Re-fetch courses to get updated data
      fetchCourses();

    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    }
  };

  // Delete course
  const handleDelete = async (courseId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the course, its sections, and videos!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/course/${courseId}`, {
        withCredentials: true,
      });

      Swal.fire("Deleted!", "The course was deleted successfully.", "success");

      setCourses((prev) => prev.filter((c) => c._id !== courseId));
      setFiltered((prev) => prev.filter((c) => c._id !== courseId));
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || "Failed to delete course",
        "error"
      );
    }
  };

  // View course details
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
        All Courses
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Search & Sort */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
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
                        sx={{ mr: 1 }}
                      >
                        {c.isPublished ? "Unpublish" : "Publish"}
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(c._id)}
                      >
                        Delete
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

      {/* Course Preview Popup */}
      <CourseDetailsPopup
        open={open}
        handleClose={handleClose}
        selectedCourse={selectedCourse}
      />
    </Paper>
  );
}
