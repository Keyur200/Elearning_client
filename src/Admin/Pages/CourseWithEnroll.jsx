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
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import Swal from "sweetalert2";

export default function CourseWithEnroll() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [message, setMessage] = useState("");



  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/courses/enrollments`);

      const data = res.data.data;

      setCourses(data || []);
      setFiltered(data || []);

      if (!data?.length) {
        setMessage("No courses found.");
      }
    } catch (err) {
      setMessage("Error fetching courses");
    }
  };

  // Searching & Sorting
  const handleSearchSort = useCallback(() => {
    let temp = [...courses];

    if (searchTerm) {
      temp = temp.filter((c) =>
        c.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortKey === "courseName") {
      temp.sort((a, b) => a.courseName.localeCompare(b.courseName));
    }

    setFiltered(temp);
    setPage(0);
  }, [courses, searchTerm, sortKey]);

  useEffect(() => {
    handleSearchSort();
  }, [handleSearchSort]);

  const handleChangePage = (e, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  return (
    <Paper sx={{ width: "98%", p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Courses & Enrollments
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Search & Sort */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField
          label="Search by course name"
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
          <MenuItem value="courseName">Course Name (A-Z)</MenuItem>
        </TextField>

        <Box sx={{ flexGrow: 1 }} />
      </Stack>

      {message && <Typography color="error">{message}</Typography>}

      {/* Table */}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Enrolled Users</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No courses found.
                </TableCell>
              </TableRow>
            ) : (
              filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((c, i) => (
                  <TableRow key={c.courseId}>
                    <TableCell>{page * rowsPerPage + i + 1}</TableCell>

                    <TableCell>{c.courseName}</TableCell>

                    <TableCell>{c.enrolledCount}</TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => {
                          const tableHTML = `
    <table style="width:100%; border-collapse: collapse;">
      <thead>
        <tr style="background:#f1f1f1;">
          <th style="padding:8px; border:1px solid #ddd;">#</th>
          <th style="padding:8px; border:1px solid #ddd;">Name</th>
          <th style="padding:8px; border:1px solid #ddd;">Email</th>
        </tr>
      </thead>
      <tbody>
        ${c.enrolledUsers
                              .map(
                                (u, index) => `
            <tr>
              <td style="padding:8px; border:1px solid #ddd;">${index + 1}</td>
              <td style="padding:8px; border:1px solid #ddd;">${u.name}</td>
              <td style="padding:8px; border:1px solid #ddd;">${u.email}</td>
            </tr>
          `
                              )
                              .join("")
                            }
      </tbody>
    </table>
  `;

                          Swal.fire({
                            title: `Users enrolled in ${c.courseName}`,
                            html: tableHTML,
                            width: 500,
                            confirmButtonText: "Close",
                          });
                        }}

                      >
                        View Users
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={filtered.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
