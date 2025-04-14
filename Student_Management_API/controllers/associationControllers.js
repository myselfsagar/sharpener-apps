const { Student, Department } = require("../models");

const addValuesToStudentAndDepartment = async (req, res) => {
  try {
    const { departmentName, students } = req.body;

    // Validate input
    if (!departmentName || !Array.isArray(students) || students.length === 0) {
      return res
        .status(400)
        .json({ Error: "Department name and students list are required!" });
    }

    // Create the department
    const department = await Department.create({ name: departmentName });

    // Create students and associate them with the department
    const studentInstances = await Promise.all(
      students.map(
        (studentData) =>
          Student.create({ ...studentData, DepartmentId: department.id }) // Assign foreign key
      )
    );

    res.status(201).json({
      message: "Department and students added successfully!",
      department,
      students: studentInstances,
    });
  } catch (err) {
    console.error("Error adding department and students:", err);
    res
      .status(500)
      .json({ Error: `Error adding department and students: ${err.message}` });
  }
};

module.exports = { addValuesToStudentAndDepartment };
