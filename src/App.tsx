import React, { useEffect, useState } from "react";
import "./App.css";
import { axiosInstance } from "./hooks/axiosRequest";
import { StudentInterface } from "./interfaces/student.interface";
import { CourseInterface } from "./interfaces/course.interface";

import {
  Box,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import * as Yup from "yup";
import { useFormik } from "formik";

/**
 * Validation Schemas
 */
const validateStudent = Yup.object({
  name: Yup.string().required("Name is required"),
  studentId: Yup.string().required("Student ID is required"),
  dob: Yup.date().required("Date of Birth is required"),
  address: Yup.string().required("Address is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  prefix: Yup.string().required("Prefix is required"),
  typeOfSubject: Yup.string().required("Type of Subject is required"),
  FieldOfStudy: Yup.string().required("Field of Study is required"),
  FieldOfWork: Yup.string().required("Field of Work is required"),
  classRoom: Yup.string().required("Class Room is required"),
  year: Yup.string().required("Year is required"),
});

const validateCourse = Yup.object({
  nameOfCourse: Yup.string().required("Name of Course is required"),
  codeOfCourse: Yup.string().required("Code of Course is required"),
  credit: Yup.number().required("Credit is required"),
  hours: Yup.number().required("Hours is required"),
});

function App() {
  /**
   * States to store arrays of students and courses
   */
  const [users, setUsers] = useState<StudentInterface[] | null>(null);
  const [courses, setCourses] = useState<CourseInterface[] | null>(null);

  /**
   * States & booleans for editing a student
   */
  const [openEditStudent, setOpenEditStudent] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentInterface | null>(null);

  /**
   * States & booleans for editing a course
   */
  const [openEditCourse, setOpenEditCourse] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<CourseInterface | null>(null);

  /**
   * Fetch Functions
   */
  const fetchUser = async () => {
    const response = await axiosInstance.get<{ students: StudentInterface[] }>("/api/students");
    setUsers(response.data.students);
  };

  const fetchCourse = async () => {
    const response = await axiosInstance.get<{ courses: CourseInterface[] }>("/api/courses");
    setCourses(response.data.courses);
  };

  useEffect(() => {
    fetchUser();
    fetchCourse();
  }, []);

  /**
   * Create Formik (student)
   */
  const formikStudent = useFormik({
    initialValues: {
      name: "",
      studentId: "",
      dob: "",
      address: "",
      phoneNumber: "",
      prefix: "",
      typeOfSubject: "",
      FieldOfStudy: "",
      FieldOfWork: "",
      classRoom: "",
      year: "",
    },
    validationSchema: validateStudent,
    onSubmit: async (values, { resetForm }) => {
      try {
        await axiosInstance.post("/api/students", values);
        fetchUser();
        resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  });

  /**
   * Create Formik (course)
   */
  const formikCourse = useFormik({
    initialValues: {
      nameOfCourse: "",
      codeOfCourse: "",
      credit: 0,
      hours: 0,
    },
    validationSchema: validateCourse,
    onSubmit: async (values, { resetForm }) => {
      try {
        await axiosInstance.post("/api/courses", values);
        fetchCourse();
        resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  });

  /**
   * Delete Functions
   */
  const handleDeleteStudent = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/students/${id}`);
      fetchUser();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await axiosInstance.delete(`/api/courses/${id}`);
      fetchCourse();
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * --------------------
   *   EDIT STUDENT
   * --------------------
   */

  // Open edit dialog, set which student is being edited
  const handleOpenEditStudent = (student: StudentInterface) => {
    setStudentToEdit(student);
    setOpenEditStudent(true);
  };

  // Close edit dialog, reset states
  const handleCloseEditStudent = () => {
    setStudentToEdit(null);
    setOpenEditStudent(false);
  };

  // Formik for updating a student
  const formikEditStudent = useFormik<StudentInterface>({
    enableReinitialize: true, // Important so that form values update when studentToEdit changes
    initialValues: {
      _id: studentToEdit?._id || "",
      name: studentToEdit?.name || "",
      studentId: studentToEdit?.studentId || "",
      dob: studentToEdit?.dob || "",
      address: studentToEdit?.address || "",
      phoneNumber: studentToEdit?.phoneNumber || "",
      prefix: studentToEdit?.prefix || "",
      typeOfSubject: studentToEdit?.typeOfSubject || "",
      FieldOfStudy: studentToEdit?.FieldOfStudy || "",
      FieldOfWork: studentToEdit?.FieldOfWork || "",
      classRoom: studentToEdit?.classRoom || "",
      year: studentToEdit?.year || "",
    },
    validationSchema: validateStudent,
    onSubmit: async (values) => {
      try {
        // Send PUT request to update the student
        await axiosInstance.put(`/api/students/${values._id}`, values);
        fetchUser();
        handleCloseEditStudent();
      } catch (error) {
        console.error(error);
      }
    },
  });

  /**
   * --------------------
   *   EDIT COURSE
   * --------------------
   */

  // Open edit dialog, set which course is being edited
  const handleOpenEditCourse = (course: CourseInterface) => {
    setCourseToEdit(course);
    setOpenEditCourse(true);
  };

  // Close edit dialog, reset states
  const handleCloseEditCourse = () => {
    setCourseToEdit(null);
    setOpenEditCourse(false);
  };

  // Formik for updating a course
  const formikEditCourse = useFormik<CourseInterface>({
    enableReinitialize: true,
    initialValues: {
      _id: courseToEdit?._id || "",
      nameOfCourse: courseToEdit?.nameOfCourse || "",
      codeOfCourse: courseToEdit?.codeOfCourse || "",
      credit: courseToEdit?.credit || 0,
      hours: courseToEdit?.hours || 0,
    },
    validationSchema: validateCourse,
    onSubmit: async (values) => {
      try {
        // Send PUT request to update the course
        await axiosInstance.put(`/api/courses/${values._id}`, values);
        fetchCourse();
        handleCloseEditCourse();
      } catch (error) {
        console.error(error);
      }
    },
  });

  /**
   * RENDER
   */
  return (
    <>
      {/* CREATE STUDENT FORM */}
      <Box
        component="form"
        noValidate
        onSubmit={formikStudent.handleSubmit}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}
      >
        <TextField
          id="name"
          label="Name"
          {...formikStudent.getFieldProps("name")}
          error={formikStudent.touched.name && Boolean(formikStudent.errors.name)}
          helperText={formikStudent.touched.name && formikStudent.errors.name}
        />
        <TextField
          id="studentId"
          label="Student ID"
          {...formikStudent.getFieldProps("studentId")}
          error={formikStudent.touched.studentId && Boolean(formikStudent.errors.studentId)}
          helperText={formikStudent.touched.studentId && formikStudent.errors.studentId}
        />
        <TextField
          id="dob"
          label="Date of Birth"
          type="date"
          InputLabelProps={{ shrink: true }}
          {...formikStudent.getFieldProps("dob")}
          error={formikStudent.touched.dob && Boolean(formikStudent.errors.dob)}
          helperText={formikStudent.touched.dob && formikStudent.errors.dob}
        />
        <TextField
          id="address"
          label="Address"
          {...formikStudent.getFieldProps("address")}
          error={formikStudent.touched.address && Boolean(formikStudent.errors.address)}
          helperText={formikStudent.touched.address && formikStudent.errors.address}
        />
        <TextField
          id="phoneNumber"
          label="Phone Number"
          {...formikStudent.getFieldProps("phoneNumber")}
          error={formikStudent.touched.phoneNumber && Boolean(formikStudent.errors.phoneNumber)}
          helperText={formikStudent.touched.phoneNumber && formikStudent.errors.phoneNumber}
        />
        <TextField
          id="prefix"
          label="Prefix"
          {...formikStudent.getFieldProps("prefix")}
          error={formikStudent.touched.prefix && Boolean(formikStudent.errors.prefix)}
          helperText={formikStudent.touched.prefix && formikStudent.errors.prefix}
        />
        <TextField
          id="typeOfSubject"
          label="Type of Subject"
          {...formikStudent.getFieldProps("typeOfSubject")}
          error={formikStudent.touched.typeOfSubject && Boolean(formikStudent.errors.typeOfSubject)}
          helperText={formikStudent.touched.typeOfSubject && formikStudent.errors.typeOfSubject}
        />
        <TextField
          id="FieldOfStudy"
          label="Field of Study"
          {...formikStudent.getFieldProps("FieldOfStudy")}
          error={formikStudent.touched.FieldOfStudy && Boolean(formikStudent.errors.FieldOfStudy)}
          helperText={formikStudent.touched.FieldOfStudy && formikStudent.errors.FieldOfStudy}
        />
        <TextField
          id="FieldOfWork"
          label="Field of Work"
          {...formikStudent.getFieldProps("FieldOfWork")}
          error={formikStudent.touched.FieldOfWork && Boolean(formikStudent.errors.FieldOfWork)}
          helperText={formikStudent.touched.FieldOfWork && formikStudent.errors.FieldOfWork}
        />
        <TextField
          id="classRoom"
          label="Class Room"
          {...formikStudent.getFieldProps("classRoom")}
          error={formikStudent.touched.classRoom && Boolean(formikStudent.errors.classRoom)}
          helperText={formikStudent.touched.classRoom && formikStudent.errors.classRoom}
        />
        <TextField
          id="year"
          label="Year"
          {...formikStudent.getFieldProps("year")}
          error={formikStudent.touched.year && Boolean(formikStudent.errors.year)}
          helperText={formikStudent.touched.year && formikStudent.errors.year}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Create Student
        </Button>
      </Box>

      {/* CREATE COURSE FORM */}
      <Box
        component="form"
        noValidate
        onSubmit={formikCourse.handleSubmit}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: 3 }}
      >
        <TextField
          id="nameOfCourse"
          label="Name of Course"
          {...formikCourse.getFieldProps("nameOfCourse")}
          error={formikCourse.touched.nameOfCourse && Boolean(formikCourse.errors.nameOfCourse)}
          helperText={formikCourse.touched.nameOfCourse && formikCourse.errors.nameOfCourse}
        />
        <TextField
          id="codeOfCourse"
          label="Code of Course"
          {...formikCourse.getFieldProps("codeOfCourse")}
          error={formikCourse.touched.codeOfCourse && Boolean(formikCourse.errors.codeOfCourse)}
          helperText={formikCourse.touched.codeOfCourse && formikCourse.errors.codeOfCourse}
        />
        <TextField
          id="credit"
          label="Credit"
          type="number"
          {...formikCourse.getFieldProps("credit")}
          error={formikCourse.touched.credit && Boolean(formikCourse.errors.credit)}
          helperText={formikCourse.touched.credit && formikCourse.errors.credit}
        />
        <TextField
          id="hours"
          label="Hours"
          type="number"
          {...formikCourse.getFieldProps("hours")}
          error={formikCourse.touched.hours && Boolean(formikCourse.errors.hours)}
          helperText={formikCourse.touched.hours && formikCourse.errors.hours}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Create Course
        </Button>
      </Box>

      {/* STUDENTS TABLE */}
      <TableContainer component={Paper} sx={{ mt: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Student ID</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Prefix</TableCell>
              <TableCell>Type of Subject</TableCell>
              <TableCell>Field of Study</TableCell>
              <TableCell>Field of Work</TableCell>
              <TableCell>Class Room</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.studentId}</TableCell>
                <TableCell>{user.dob}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.prefix}</TableCell>
                <TableCell>{user.typeOfSubject}</TableCell>
                <TableCell>{user.FieldOfStudy}</TableCell>
                <TableCell>{user.FieldOfWork}</TableCell>
                <TableCell>{user.classRoom}</TableCell>
                <TableCell>{user.year}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenEditStudent(user)}>Edit</Button>
                  <Button onClick={() => handleDeleteStudent(user._id)} color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* COURSES TABLE */}
      <TableContainer component={Paper} sx={{ mt: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name of Course</TableCell>
              <TableCell>Code of Course</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Hours</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses?.map((course) => (
              <TableRow key={course._id}>
                <TableCell>{course.nameOfCourse}</TableCell>
                <TableCell>{course.codeOfCourse}</TableCell>
                <TableCell>{course.credit}</TableCell>
                <TableCell>{course.hours}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenEditCourse(course)}>Edit</Button>
                  <Button onClick={() => handleDeleteCourse(course._id)} color="error">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ------------------------- EDIT STUDENT DIALOG ------------------------- */}
      <Dialog open={openEditStudent} onClose={handleCloseEditStudent}>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={formikEditStudent.handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Name"
              {...formikEditStudent.getFieldProps("name")}
              error={formikEditStudent.touched.name && Boolean(formikEditStudent.errors.name)}
              helperText={formikEditStudent.touched.name && formikEditStudent.errors.name}
            />
            <TextField
              label="Student ID"
              {...formikEditStudent.getFieldProps("studentId")}
              error={formikEditStudent.touched.studentId && Boolean(formikEditStudent.errors.studentId)}
              helperText={formikEditStudent.touched.studentId && formikEditStudent.errors.studentId}
            />
            <TextField
              label="Date of Birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...formikEditStudent.getFieldProps("dob")}
              error={formikEditStudent.touched.dob && Boolean(formikEditStudent.errors.dob)}
              helperText={formikEditStudent.touched.dob && formikEditStudent.errors.dob}
            />
            <TextField
              label="Address"
              {...formikEditStudent.getFieldProps("address")}
              error={formikEditStudent.touched.address && Boolean(formikEditStudent.errors.address)}
              helperText={formikEditStudent.touched.address && formikEditStudent.errors.address}
            />
            <TextField
              label="Phone Number"
              {...formikEditStudent.getFieldProps("phoneNumber")}
              error={formikEditStudent.touched.phoneNumber && Boolean(formikEditStudent.errors.phoneNumber)}
              helperText={formikEditStudent.touched.phoneNumber && formikEditStudent.errors.phoneNumber}
            />
            <TextField
              label="Prefix"
              {...formikEditStudent.getFieldProps("prefix")}
              error={formikEditStudent.touched.prefix && Boolean(formikEditStudent.errors.prefix)}
              helperText={formikEditStudent.touched.prefix && formikEditStudent.errors.prefix}
            />
            <TextField
              label="Type of Subject"
              {...formikEditStudent.getFieldProps("typeOfSubject")}
              error={formikEditStudent.touched.typeOfSubject && Boolean(formikEditStudent.errors.typeOfSubject)}
              helperText={formikEditStudent.touched.typeOfSubject && formikEditStudent.errors.typeOfSubject}
            />
            <TextField
              label="Field of Study"
              {...formikEditStudent.getFieldProps("FieldOfStudy")}
              error={formikEditStudent.touched.FieldOfStudy && Boolean(formikEditStudent.errors.FieldOfStudy)}
              helperText={formikEditStudent.touched.FieldOfStudy && formikEditStudent.errors.FieldOfStudy}
            />
            <TextField
              label="Field of Work"
              {...formikEditStudent.getFieldProps("FieldOfWork")}
              error={formikEditStudent.touched.FieldOfWork && Boolean(formikEditStudent.errors.FieldOfWork)}
              helperText={formikEditStudent.touched.FieldOfWork && formikEditStudent.errors.FieldOfWork}
            />
            <TextField
              label="Class Room"
              {...formikEditStudent.getFieldProps("classRoom")}
              error={formikEditStudent.touched.classRoom && Boolean(formikEditStudent.errors.classRoom)}
              helperText={formikEditStudent.touched.classRoom && formikEditStudent.errors.classRoom}
            />
            <TextField
              label="Year"
              {...formikEditStudent.getFieldProps("year")}
              error={formikEditStudent.touched.year && Boolean(formikEditStudent.errors.year)}
              helperText={formikEditStudent.touched.year && formikEditStudent.errors.year}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditStudent}>Cancel</Button>
          <Button onClick={() => formikEditStudent.handleSubmit()} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ------------------------- EDIT COURSE DIALOG ------------------------- */}
      <Dialog open={openEditCourse} onClose={handleCloseEditCourse}>
        <DialogTitle>Edit Course</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            onSubmit={formikEditCourse.handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
          >
            <TextField
              label="Name of Course"
              {...formikEditCourse.getFieldProps("nameOfCourse")}
              error={formikEditCourse.touched.nameOfCourse && Boolean(formikEditCourse.errors.nameOfCourse)}
              helperText={formikEditCourse.touched.nameOfCourse && formikEditCourse.errors.nameOfCourse}
            />
            <TextField
              label="Code of Course"
              {...formikEditCourse.getFieldProps("codeOfCourse")}
              error={formikEditCourse.touched.codeOfCourse && Boolean(formikEditCourse.errors.codeOfCourse)}
              helperText={formikEditCourse.touched.codeOfCourse && formikEditCourse.errors.codeOfCourse}
            />
            <TextField
              label="Credit"
              type="number"
              {...formikEditCourse.getFieldProps("credit")}
              error={formikEditCourse.touched.credit && Boolean(formikEditCourse.errors.credit)}
              helperText={formikEditCourse.touched.credit && formikEditCourse.errors.credit}
            />
            <TextField
              label="Hours"
              type="number"
              {...formikEditCourse.getFieldProps("hours")}
              error={formikEditCourse.touched.hours && Boolean(formikEditCourse.errors.hours)}
              helperText={formikEditCourse.touched.hours && formikEditCourse.errors.hours}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditCourse}>Cancel</Button>
          <Button onClick={() => formikEditCourse.handleSubmit()} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
