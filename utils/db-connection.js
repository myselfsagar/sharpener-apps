const mysql = require("mysql2");

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "student_app",
});

const createStudentTable = () => {
  const createTableQuery = `CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(50) UNIQUE,
    age INT
  )`;
  dbConnection.execute(createTableQuery, (err) => {
    if (err) {
      console.log("Error creating table", err);
      return;
    }
  });
};

dbConnection.connect((err) => {
  if (err) {
    console.log("Error connecting db", err);
    return;
  }

  createStudentTable();
});

module.exports = dbConnection;
