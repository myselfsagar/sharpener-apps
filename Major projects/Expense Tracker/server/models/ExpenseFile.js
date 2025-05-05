const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const ExpenseFile = sequelize.define("ExpenseFile", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  fileUrl: { type: DataTypes.STRING, allowNull: false },
  fileName: { type: DataTypes.STRING, allowNull: false },
  downloadedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

module.exports = ExpenseFile;
