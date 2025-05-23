const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM("basic", "premium"), defaultValue: "basic" },
  totalExpense: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = User;
