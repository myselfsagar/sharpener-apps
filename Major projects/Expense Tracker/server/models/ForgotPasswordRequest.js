const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const { v4: uuidv4 } = require("uuid");

const ForgotPasswordRequest = sequelize.define("forgotPasswordRequests", {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4, // Auto-generate UUID
    primaryKey: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true, // Start as active until user resets password
  },
  expiresBy: {
    type: DataTypes.DATE, // Expiration timestamp for link validity
    allowNull: false,
  },
});

module.exports = ForgotPasswordRequest;
