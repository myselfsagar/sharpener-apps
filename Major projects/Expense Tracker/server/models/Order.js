const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

const Order = sequelize.define(
  "orders",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.STRING, unique: true, allowNull: false },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    order_amount: { type: DataTypes.INTEGER, allowNull: false },
    payment_status: {
      type: DataTypes.ENUM("PENDING", "SUCCESSFUL", "FAILED"),
      defaultValue: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Order;
