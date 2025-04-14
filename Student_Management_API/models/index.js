const Student = require("./Student");
const Department = require("./Department");

//One to many association
Department.hasMany(Student);
Student.belongsTo(Department);

module.exports = {
  Student,
  Department,
};
