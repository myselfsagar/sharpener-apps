const express = require("express");
const router = express.Router();

//course database
const courses = [
  { id: 1, name: "Frontend", description: "HTML, CSS, JS, React" },
  { id: 2, name: "Backend", description: "Node.js, Express, MongoDB" },
];

// List all courses
router.get("/", (req, res) => {
  res.send("Courses: Frontend, Backend");
});

//Fetch a course by ID.
router.get("/:id", (req, res) => {
  const courseId = parseInt(req.params.id);
  const course = courses.find((course) => course.id === courseId);

  if (!course) {
    return res.status(404).send("Course not found");
  }

  res.send(`Course: ${course.name}, Description: ${course.description}`);
});

module.exports = router;
