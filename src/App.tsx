import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Snackbar,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import axios from "axios"; // or wherever your axiosInstance is defined
import * as Yup from "yup";
import { useFormik } from "formik";

/**
 * --------------------------------------------------
 * 1) Interfaces
 * --------------------------------------------------
 */
interface StudentInterface {
  _id?: string;
  name: string;
  studentId: string;
  dob: string; // or Date
  address: string;
  phoneNumber: string;
  prefix: string;
  typeOfSubject: string;
  fieldOfStudy: string;
  fieldOfWork: string;
  classRoom: string;
  year: string;
}

interface CourseInterface {
  _id?: string;
  nameOfCourse: string;
  codeOfCourse: string;
  credit: number;
  hours: number;
}

/**
 * --------------------------------------------------
 * 2) API Functions (Optional)
 *    - Could live in a separate "api.ts" or "services" folder
 * --------------------------------------------------
 */
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // example
});

async function fetchAllStudents(): Promise<StudentInterface[]> {
  const { data } = await axiosInstance.get("/api/students");
  return data.students;
}

async function createStudent(studentData: Omit<StudentInterface, "_id">) {
  await axiosInstance.post("/api/students", studentData);
}

async function updateStudent(id: string, studentData: Omit<StudentInterface, "_id">) {
  await axiosInstance.put(`/api/students/${id}`, studentData);
}

async function deleteStudent(id: string) {
  await axiosInstance.delete(`/api/students/${id}`);
}

async function fetchAllCourses(): Promise<CourseInterface[]> {
  const { data } = await axiosInstance.get("/api/courses");
  return data.courses;
}

async function createCourse(courseData: Omit<CourseInterface, "_id">) {
  await axiosInstance.post("/api/courses", courseData);
}

async function updateCourse(id: string, courseData: Omit<CourseInterface, "_id">) {
  await axiosInstance.put(`/api/courses/${id}`, courseData);
}

async function deleteCourse(id: string) {
  await axiosInstance.delete(`/api/courses/${id}`);
}

/**
 * --------------------------------------------------
 * 3) Yup Validation Schemas
 * --------------------------------------------------
 */
const studentSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  studentId: Yup.string().required("Student ID is required"),
  dob: Yup.string().required("Date of Birth is required"),
  address: Yup.string().required("Address is required"),
  phoneNumber: Yup.string().required("Phone Number is required"),
  prefix: Yup.string().required("Prefix is required"),
  typeOfSubject: Yup.string().required("Type of Subject is required"),
  fieldOfStudy: Yup.string().required("Field of Study is required"),
  fieldOfWork: Yup.string().required("Field of Work is required"),
  classRoom: Yup.string().required("Class Room is required"),
  year: Yup.string().required("Year is required"),
});

const courseSchema = Yup.object({
  nameOfCourse: Yup.string().required("Name of Course is required"),
  codeOfCourse: Yup.string().required("Code of Course is required"),
  credit: Yup.number().required("Credit is required"),
  hours: Yup.number().required("Hours is required"),
});

/**
 * --------------------------------------------------
 * 4) Reusable Helpers
 * --------------------------------------------------
 */
function ConfirmDelete(callback: () => void) {
  if (window.confirm("Are you sure you want to delete this record?")) {
    callback();
  }
}

/**
 * --------------------------------------------------
 * 5) StudentForm Component
 * --------------------------------------------------
 */
interface StudentFormProps {
  editingStudent: StudentInterface | null;
  onSuccess: () => void; // callback to refetch or update list
  onCancelEdit: () => void;
  setSnackbarMessage: (msg: string, severity?: "success" | "error") => void;
}

const StudentForm: React.FC<StudentFormProps> = ({
  editingStudent,
  onSuccess,
  onCancelEdit,
  setSnackbarMessage,
}) => {
  const formik = useFormik<StudentInterface>({
    initialValues: {
      _id: editingStudent?._id,
      name: editingStudent?.name || "",
      studentId: editingStudent?.studentId || "",
      dob: editingStudent?.dob || "",
      address: editingStudent?.address || "",
      phoneNumber: editingStudent?.phoneNumber || "",
      prefix: editingStudent?.prefix || "",
      typeOfSubject: editingStudent?.typeOfSubject || "",
      fieldOfStudy: editingStudent?.fieldOfStudy || "",
      fieldOfWork: editingStudent?.fieldOfWork || "",
      classRoom: editingStudent?.classRoom || "",
      year: editingStudent?.year || "",
    },
    validationSchema: studentSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingStudent?._id) {
          // Update
          await updateStudent(editingStudent._id, values);
          setSnackbarMessage("Student updated successfully!");
        } else {
          // Create
          await createStudent(values);
          setSnackbarMessage("Student created successfully!");
        }
        resetForm();
        onSuccess();
      } catch (error) {
        console.error(error);
        setSnackbarMessage("Failed to save student", "error");
      }
    },
  });

  return (
    <Box
      component="form"
      noValidate
      onSubmit={formik.handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <TextField
        id="name"
        name="name"
        label="Name"
        value={formik.values.name}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.name && !!formik.errors.name}
        helperText={formik.touched.name && formik.errors.name}
      />
      <TextField
        id="studentId"
        name="studentId"
        label="Student ID"
        value={formik.values.studentId}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.studentId && !!formik.errors.studentId}
        helperText={formik.touched.studentId && formik.errors.studentId}
        disabled={!!editingStudent?._id}
      />
      <TextField
        id="dob"
        name="dob"
        label="Date of Birth"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={formik.values.dob}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.dob && !!formik.errors.dob}
        helperText={formik.touched.dob && formik.errors.dob}
      />
      <TextField
        id="address"
        name="address"
        label="Address"
        value={formik.values.address}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.address && !!formik.errors.address}
        helperText={formik.touched.address && formik.errors.address}
      />
      <TextField
        id="phoneNumber"
        name="phoneNumber"
        label="Phone Number"
        value={formik.values.phoneNumber}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
      />
      <TextField
        id="prefix"
        name="prefix"
        label="Prefix"
        value={formik.values.prefix}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.prefix && !!formik.errors.prefix}
        helperText={formik.touched.prefix && formik.errors.prefix}
      />
      <TextField
        id="typeOfSubject"
        name="typeOfSubject"
        label="Type of Subject"
        value={formik.values.typeOfSubject}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.typeOfSubject && !!formik.errors.typeOfSubject}
        helperText={formik.touched.typeOfSubject && formik.errors.typeOfSubject}
      />
      <TextField
        id="fieldOfStudy"
        name="fieldOfStudy"
        label="Field of Study"
        value={formik.values.fieldOfStudy}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.fieldOfStudy && !!formik.errors.fieldOfStudy}
        helperText={formik.touched.fieldOfStudy && formik.errors.fieldOfStudy}
      />
      <TextField
        id="fieldOfWork"
        name="fieldOfWork"
        label="Field of Work"
        value={formik.values.fieldOfWork}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.fieldOfWork && !!formik.errors.fieldOfWork}
        helperText={formik.touched.fieldOfWork && formik.errors.fieldOfWork}
      />
      <TextField
        id="classRoom"
        name="classRoom"
        label="Class Room"
        value={formik.values.classRoom}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.classRoom && !!formik.errors.classRoom}
        helperText={formik.touched.classRoom && formik.errors.classRoom}
      />
      <TextField
        id="year"
        name="year"
        label="Year"
        value={formik.values.year}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.year && !!formik.errors.year}
        helperText={formik.touched.year && formik.errors.year}
      />
      <Button type="submit" variant="contained">
        {editingStudent?._id ? "Update Student" : "Add Student"}
      </Button>

      {editingStudent?._id && (
        <Button variant="outlined" onClick={onCancelEdit}>
          Cancel
        </Button>
      )}
    </Box>
  );
};

/**
 * --------------------------------------------------
 * 6) StudentsTable Component
 * --------------------------------------------------
 */
interface StudentsTableProps {
  students: StudentInterface[];
  onEdit: (student: StudentInterface) => void;
  onDelete: (id: string) => void;
}

const StudentsTable: React.FC<StudentsTableProps> = ({ students, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ marginTop: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Student ID</TableCell>
            <TableCell>DOB</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Prefix</TableCell>
            <TableCell>Subject Type</TableCell>
            <TableCell>Field Of Study</TableCell>
            <TableCell>Field Of Work</TableCell>
            <TableCell>Class Room</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student._id}>
              <TableCell>{student.name}</TableCell>
              <TableCell>{student.studentId}</TableCell>
              <TableCell>{student.dob}</TableCell>
              <TableCell>{student.address}</TableCell>
              <TableCell>{student.phoneNumber}</TableCell>
              <TableCell>{student.prefix}</TableCell>
              <TableCell>{student.typeOfSubject}</TableCell>
              <TableCell>{student.fieldOfStudy}</TableCell>
              <TableCell>{student.fieldOfWork}</TableCell>
              <TableCell>{student.classRoom}</TableCell>
              <TableCell>{student.year}</TableCell>
              <TableCell>
                <Button onClick={() => onEdit(student)}>Edit</Button>
                <Button onClick={() => ConfirmDelete(() => onDelete(student._id!))} color="error">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

/**
 * --------------------------------------------------
 * 7) StudentsContainer: Combines Form + Table for Students
 * --------------------------------------------------
 */
const StudentsContainer: React.FC = () => {
  const [students, setStudents] = useState<StudentInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingStudent, setEditingStudent] = useState<StudentInterface | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const setSnackbarMessage = (msg: string, severity: "success" | "error" = "success") => {
    setSnackbarMsg(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Fetch students
  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchAllStudents();
      setStudents(data);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to load students", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // Handlers
  const handleEditStudent = (student: StudentInterface) => {
    setEditingStudent(student);
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteStudent(id);
      setSnackbarMessage("Student deleted");
      loadStudents();
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to delete student", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  const handleSuccess = () => {
    // When form is successfully submitted (create/update)
    setEditingStudent(null);
    loadStudents();
  };

  return (
    <Box sx={{ marginBottom: 6 }}>
      <h2>{editingStudent ? "Edit Student" : "Add Student"}</h2>
      <StudentForm
        editingStudent={editingStudent}
        onSuccess={handleSuccess}
        onCancelEdit={handleCancelEdit}
        setSnackbarMessage={setSnackbarMessage}
      />

      <h3>Students List</h3>
      {loading ? (
        <CircularProgress />
      ) : (
        <StudentsTable
          students={students}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

/**
 * --------------------------------------------------
 * 8) CourseForm & Table
 * --------------------------------------------------
 */
interface CourseFormProps {
  editingCourse: CourseInterface | null;
  onSuccess: () => void;
  onCancelEdit: () => void;
  setSnackbarMessage: (msg: string, severity?: "success" | "error") => void;
}

const CourseForm: React.FC<CourseFormProps> = ({
  editingCourse,
  onSuccess,
  onCancelEdit,
  setSnackbarMessage,
}) => {
  const formik = useFormik<CourseInterface>({
    initialValues: {
      _id: editingCourse?._id,
      nameOfCourse: editingCourse?.nameOfCourse || "",
      codeOfCourse: editingCourse?.codeOfCourse || "",
      credit: editingCourse?.credit || 0,
      hours: editingCourse?.hours || 0,
    },
    validationSchema: courseSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingCourse?._id) {
          // Update
          await updateCourse(editingCourse._id, values);
          setSnackbarMessage("Course updated successfully!");
        } else {
          // Create
          await createCourse(values);
          setSnackbarMessage("Course created successfully!");
        }
        resetForm();
        onSuccess();
      } catch (error) {
        console.error(error);
        setSnackbarMessage("Failed to save course", "error");
      }
    },
  });

  return (
    <Box
      component="form"
      noValidate
      onSubmit={formik.handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <TextField
        id="nameOfCourse"
        name="nameOfCourse"
        label="Name of Course"
        value={formik.values.nameOfCourse}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.nameOfCourse && !!formik.errors.nameOfCourse}
        helperText={formik.touched.nameOfCourse && formik.errors.nameOfCourse}
      />
      <TextField
        id="codeOfCourse"
        name="codeOfCourse"
        label="Code of Course"
        value={formik.values.codeOfCourse}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.codeOfCourse && !!formik.errors.codeOfCourse}
        helperText={formik.touched.codeOfCourse && formik.errors.codeOfCourse}
        disabled={!!editingCourse?._id}
      />
      <TextField
        id="credit"
        name="credit"
        label="Credit"
        type="number"
        value={formik.values.credit}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.credit && !!formik.errors.credit}
        helperText={formik.touched.credit && formik.errors.credit}
      />
      <TextField
        id="hours"
        name="hours"
        label="Hours"
        type="number"
        value={formik.values.hours}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.hours && !!formik.errors.hours}
        helperText={formik.touched.hours && formik.errors.hours}
      />

      <Button type="submit" variant="contained">
        {editingCourse?._id ? "Update Course" : "Add Course"}
      </Button>
      {editingCourse?._id && (
        <Button variant="outlined" onClick={onCancelEdit}>
          Cancel
        </Button>
      )}
    </Box>
  );
};

interface CoursesTableProps {
  courses: CourseInterface[];
  onEdit: (course: CourseInterface) => void;
  onDelete: (id: string) => void;
}

const CoursesTable: React.FC<CoursesTableProps> = ({ courses, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ marginTop: 3 }}>
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
          {courses.map((course) => (
            <TableRow key={course._id}>
              <TableCell>{course.nameOfCourse}</TableCell>
              <TableCell>{course.codeOfCourse}</TableCell>
              <TableCell>{course.credit}</TableCell>
              <TableCell>{course.hours}</TableCell>
              <TableCell>
                <Button onClick={() => onEdit(course)}>Edit</Button>
                <Button onClick={() => ConfirmDelete(() => onDelete(course._id!))} color="error">
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

/**
 * --------------------------------------------------
 * 9) CoursesContainer
 * --------------------------------------------------
 */
const CoursesContainer: React.FC = () => {
  const [courses, setCourses] = useState<CourseInterface[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingCourse, setEditingCourse] = useState<CourseInterface | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const setSnackbarMessage = (msg: string, severity: "success" | "error" = "success") => {
    setSnackbarMsg(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await fetchAllCourses();
      setCourses(data);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to load courses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleEditCourse = (course: CourseInterface) => {
    setEditingCourse(course);
  };

  const handleDeleteCourse = async (id: string) => {
    try {
      await deleteCourse(id);
      setSnackbarMessage("Course deleted");
      loadCourses();
    } catch (error) {
      console.error(error);
      setSnackbarMessage("Failed to delete course", "error");
    }
  };

  const handleCancelEdit = () => {
    setEditingCourse(null);
  };

  const handleSuccess = () => {
    setEditingCourse(null);
    loadCourses();
  };

  return (
    <Box sx={{ marginBottom: 6 }}>
      <h2>{editingCourse ? "Edit Course" : "Add Course"}</h2>
      <CourseForm
        editingCourse={editingCourse}
        onSuccess={handleSuccess}
        onCancelEdit={handleCancelEdit}
        setSnackbarMessage={setSnackbarMessage}
      />

      <h3>Courses List</h3>
      {loading ? (
        <CircularProgress />
      ) : (
        <CoursesTable courses={courses} onEdit={handleEditCourse} onDelete={handleDeleteCourse} />
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

/**
 * --------------------------------------------------
 * 10) Main App Component
 * --------------------------------------------------
 */
function App() {
  return (
    <Box sx={{ padding: 3 }}>
      {/* Students Container */}
      <StudentsContainer />

      {/* Courses Container */}
      <CoursesContainer />
    </Box>
  );
}

export default App;
