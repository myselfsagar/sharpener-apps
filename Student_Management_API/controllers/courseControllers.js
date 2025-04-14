const { success, error } = require("../utils/responseWrapper");
const { Course, Student } = require("../models");

const addCourse = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.send(error(400, "Course name is mandatory"));
    }

    const course = await Course.create({
      name: name,
    });

    return res.send(success(200, course));
  } catch (err) {
    console.log("Error inserting values in the table", err);
    return res.send(
      error(500, `Error inserting values in the table - ${err.message}`)
    );
  }
};

const addCoursesToStudent = async (req, res) => {
  // //payload
  // "studentId":1,
  // "courseIds":[1,2]
  try {
    const { studentId, courseIds } = req.body;

    if (!studentId || !Array.isArray(courseIds) || courseIds.length === 0) {
      return res.send(error(400, "StudentId and courseIds are required!"));
    }

    // Find student
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.send(error(404, "Student not found!"));
    }

    // Find courses
    const courses = await Course.findAll({
      where: { id: courseIds },
    });
    if (courses.length === 0) {
      return res.send(error(404, "Courses not found!"));
    }

    // Associate courses with student
    await student.addCourses(courses);

    // Fetch updated student details with associated courses
    const updatedStudent = await Student.findByPk(studentId, {
      include: Course,
    });

    res.send(success(200, updatedStudent));
  } catch (err) {
    console.log(`Error adding courses to student - ${err}`);
    return res.send(error(500, err.message));
  }
};

const addStudentsToCourse = async (req, res) => {
  try {
    const { courseId, studentIds } = req.body;

    if (!courseId || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.send(error(400, "CourseId and studentIds are required!"));
    }

    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.send(error(404, "Course not found!"));
    }

    const students = await Student.findAll({
      where: { id: studentIds },
    });
    if (students.length === 0) {
      return res.send(error(404, "Students not found!"));
    }

    await course.addStudents(students); // Adding multiple students to the course

    const updatedCourse = await Course.findByPk(courseId, { include: Student });

    res.send(success(200, updatedCourse));
  } catch (err) {
    console.error(`Error adding students to course - ${err}`);
    res.send(error(500, `Error adding students - ${err.message}`));
  }
};

module.exports = { addCourse, addCoursesToStudent, addStudentsToCourse };
