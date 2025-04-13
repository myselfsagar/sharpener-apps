const dbConnection = require("../utils/db-connection");
const { success, error } = require("../utils/responseWrapper");

const addStudent = (req, res) => {
  const { name, email, age } = req.body;
  if (!name || !email || !age) {
    return res.send(error(400, "Name, email and age all are mandatory"));
  }

  const addStudentQuery =
    "INSERT INTO students (name, email, age) VALUES (?, ?, ?)";
  dbConnection.execute(addStudentQuery, [name, email, age], (err) => {
    if (err) {
      console.log("Error inserting values in the table", err);
      dbConnection.end();
      return res.send(
        error(500, `Error inserting values in the table - ${err.message}`)
      );
    }

    console.log(`Student with name ${name} added`);
    return res.send(success(200, `Student with name ${name} added`));
  });
};

const getAllStudents = (req, res) => {
  const getAllStudentsQuery = "SELECT * FROM students";
  dbConnection.execute(getAllStudentsQuery, (err, result) => {
    if (err) {
      console.log("Error fetching all students", err);
      dbConnection.end();
      return res.send(
        error(500, `Error fetching all students - ${err.message}`)
      );
    }

    console.log(`All students fetched`);
    return res.send(success(200, result));
  });
};

const getStudentById = (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  if (isNaN(studentId)) {
    return res.send(error(400, "Invalid student id. Must be a number."));
  }

  const getStudentByIdQuery = "SELECT * FROM students WHERE id = ?";
  dbConnection.execute(getStudentByIdQuery, [studentId], (err, result) => {
    if (err) {
      console.log(`Error fetching student with id ${studentId} - ${err}`);
      dbConnection.end();
      return res.send(
        error(
          500,
          `Error fetching student with id ${studentId} - ${err.message}`
        )
      );
    }

    if (result.length === 0) {
      return res.send(error(404, "Student not found!"));
    }

    console.log(`Student with id ${studentId} fetched`);
    return res.send(success(200, result));
  });
};

const updateStudent = (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  if (isNaN(studentId)) {
    return res.send(error(400, "Invalid student id. Must be a number."));
  }

  const fieldsToUpdate = [];
  const values = [];

  //select that field to upadate which we recive in body
  if (req.body.name !== undefined) {
    fieldsToUpdate.push("name = ?");
    values.push(req.body.name);
  }
  if (req.body.email !== undefined) {
    fieldsToUpdate.push("email = ?");
    values.push(req.body.email);
  }
  if (req.body.age !== undefined) {
    fieldsToUpdate.push("age = ?");
    values.push(req.body.age);
  }

  // If no fields provided, return error
  if (fieldsToUpdate.length === 0) {
    return res.send(
      error(400, "At least one field must be provided for update.")
    );
  }

  values.push(studentId);

  const updateStudentQuery = `UPDATE students SET ${fieldsToUpdate.join(
    ", "
  )} WHERE id = ?`;
  //UPDATE students SET name=?, email=?, age=? WHERE id = ?
  //? will be replaced by name, email, age (whichever provided in body) and studentId

  dbConnection.execute(updateStudentQuery, values, (err, result) => {
    if (err) {
      console.log(`Error updaing student with id ${studentId} - ${err}`);
      dbConnection.end();
      return res.send(
        error(
          500,
          `Error updating student with id ${studentId} - ${err.message}`
        )
      );
    }
    if (result.affectedRows === 0) {
      return res.send(error(404, "Student not found!"));
    }
    console.log(`Student with id ${studentId} updated`);
    return res.send(success(200, `Student with id ${studentId} updated`));
  });
};

const deleteStudent = (req, res) => {
  const studentId = parseInt(req.params.id, 10);
  if (isNaN(studentId)) {
    return res.send(error(400, "Invalid student id. Must be a number."));
  }

  const deleteStudentQuery = "DELETE FROM students WHERE id = ?";
  dbConnection.execute(deleteStudentQuery, [studentId], (err, result) => {
    if (err) {
      console.log(`Error deleting student with id ${studentId} - ${err}`);
      dbConnection.end();
      return res.send(
        error(
          500,
          `Error deleting student with id ${studentId} - ${err.message}`
        )
      );
    }

    if (result.affectedRows === 0) {
      return res.send(error(404, "Student not found!"));
    }

    console.log(`Student with id ${studentId} deleted`);
    return res.send(success(200, `Student with id ${studentId} deleted`));
  });
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
