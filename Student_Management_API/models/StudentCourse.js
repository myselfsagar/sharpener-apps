const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../utils/db-connection");

const StudentCourse = sequelize.define("studentCourses", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
});

module.exports = StudentCourse;
