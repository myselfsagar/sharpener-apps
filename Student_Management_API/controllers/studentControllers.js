const { success, error } = require("../utils/responseWrapper");
const { Student } = require("../models/");

const addStudent = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.send(error(400, "Name and email are mandatory"));
    }

    const student = await Student.create({
      name: name,
      email: email,
    });

    return res.send(success(200, student));
  } catch (err) {
    console.log("Error inserting values in the table", err);
    return res.send(
      error(500, `Error inserting values in the table - ${err.message}`)
    );
  }
};

const getAllStudents = async (req, res) => {
  try {
    const allStudents = await Student.findAll();

    return res.send(success(200, allStudents));
  } catch (err) {
    console.log("Error fetching all students", err);
    return res.send(error(500, `Error fetching all students - ${err.message}`));
  }
};

const getStudentById = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10);
    if (isNaN(studentId)) {
      return res.send(error(400, "Invalid student id. Must be a number."));
    }

    const student = await Student.findByPk(studentId);

    if (!student) {
      return res.send(error(404, "Student not found!"));
    }

    return res.send(success(200, student));
  } catch (err) {
    console.log(`Error fetching student  - ${err}`);
    return res.send(error(500, `Error fetching student  - ${err.message}`));
  }
};

const updateStudent = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10);
    if (isNaN(studentId)) {
      return res.send(error(400, "Invalid student id. Must be a number."));
    }

    const { name, email } = req.body;

    const student = await Student.findByPk(studentId);

    if (name) student.name = name;
    if (email) student.email = email;

    await student.save();

    if (!student) {
      return res.send(error(404, "Student not found!"));
    }

    return res.send(success(200, student));
  } catch (err) {
    console.log(`Error updaing student - ${err}`);
    return res.send(error(500, `Error updating student - ${err.message}`));
  }
};

const deleteStudent = async (req, res) => {
  try {
    const studentId = parseInt(req.params.id, 10);
    if (isNaN(studentId)) {
      return res.send(error(400, "Invalid student id. Must be a number."));
    }

    const student = await Student.destroy({
      where: {
        id: studentId,
      },
    });

    if (student === 0) {
      return res.send(error(404, "Student not found!"));
    }

    return res.send(success(200, `Student with id ${studentId} deleted`));
  } catch (err) {
    console.log(`Error deleting student  - ${err}`);
    return res.send(error(500, `Error deleting student - ${err.message}`));
  }
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
