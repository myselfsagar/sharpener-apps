const router = require("express").Router();
const associationControllers = require("../controllers/associationControllers");

router.post(
  "/addToStudentWithDepartment",
  associationControllers.addValuesToStudentAndDepartment
);

module.exports = router;
