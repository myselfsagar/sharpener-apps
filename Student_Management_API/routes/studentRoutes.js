const router = require("express").Router();
const studentControllers = require("../controllers/studentControllers");

router.post("/", studentControllers.addStudent);
router.get("/", studentControllers.getAllStudents);
router.get("/:id", studentControllers.getStudentById);
router.put("/:id", studentControllers.updateStudent);
router.delete("/:id", studentControllers.deleteStudent);

module.exports = router;
