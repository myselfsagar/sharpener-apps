const Student = require("./Student");
const Department = require("./Department");
const Course = require("../models/Course");
const StudentCourse = require("../models/StudentCourse");

//One to many association
Department.hasMany(Student);
Student.belongsTo(Department);

//many to many association
Student.belongsToMany(Course, { through: StudentCourse });
Course.belongsToMany(Student, { through: StudentCourse });

module.exports = {
  Student,
  Department,
  Course,
  StudentCourse,
};
