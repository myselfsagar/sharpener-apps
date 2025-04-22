const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("expense_app", "root", "password", {
  host: "localhost",
  dialect: "mysql",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", error);
  }
})();

module.exports = sequelize;
