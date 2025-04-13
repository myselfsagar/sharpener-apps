const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("booking_appointment_app", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

(async () => {
  try {
    sequelize.authenticate();
    console.log("Connection to db has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  }
})();

module.exports = sequelize;
