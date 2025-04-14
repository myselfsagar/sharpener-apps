const router = require("express").Router();
const courseControllers = require("../controllers/courseControllers");

router.post("/", courseControllers.addCourse); // Create a new course
router.post("/addStudentCourses", courseControllers.addCoursesToStudent); // Add courses to a student
router.post("/addStudentsToCourse", courseControllers.addStudentsToCourse); // Add multiple students to a course

module.exports = router;
