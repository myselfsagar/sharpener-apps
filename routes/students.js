const express = require("express");
const router = express.Router();

//student database
const students = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

// List all students
router.get("/", (req, res) => {
  res.send("Students: Alice, Bob, Charlie");
});

//Fetch a student by ID
router.get("/:id", (req, res) => {
  const studentId = parseInt(req.params.id);
  const student = students.find((stu) => stu.id === studentId);

  if (!student) {
    return res.status(404).send("Student not found");
  }

  res.send(`Student: ${student.name}`);
});

module.exports = router;
